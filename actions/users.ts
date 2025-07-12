"use server"

import { createCloudImage, deleteCloudImage } from "@/actions/cloudImage"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { ProfileFormValues, profileSchema } from "@/schemas"
import { extractPublicId } from "cloudinary-build-url"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ユーザー情報を取得
export const getCurrentUser = async (userId: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return { error: "ユーザーが見つかりませんでした" }
    }

    return { user }
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error)
    return { error: "ユーザー情報の取得中にエラーが発生しました" }
  }
}

// ユーザープロフィールを更新
export const updateUserProfile = async (
  userId: string,
  data: ProfileFormValues
) => {
  try {
    // スキーマによるバリデーション
    const validationResult = profileSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        error: "入力データが無効です",
        validationErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // 現在のユーザー情報を取得
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!currentUser) {
      return { error: "ユーザーが見つかりませんでした" }
    }

    let imageUrl: string | null = null

    // 新しい画像があれば処理（Base64エンコードされた画像かチェック）
    if (data.image && data.image.startsWith("data:image")) {
      try {
        // 古い画像があれば削除
        if (currentUser.image) {
          try {
            const publicId = extractPublicId(currentUser.image)
            if (publicId) {
              await deleteCloudImage(publicId)
            }
          } catch (error) {
            console.error("古い画像の削除に失敗:", error)
            // 削除に失敗しても処理は続行
          }
        }

        // 新しい画像をアップロード
        const uploadResult = await createCloudImage(data.image)
        if (!uploadResult) {
          return { error: "画像のアップロードに失敗しました" }
        }
        imageUrl = uploadResult.url
      } catch (error) {
        console.error("画像アップロードエラー:", error)
        return { error: "画像のアップロードに失敗しました" }
      }
    } else {
      // Base64エンコードされていない場合は現在の画像URLかnullを使用
      imageUrl = data.image || null
    }

    // データベースに保存するデータを準備
    const updateData = {
      name: data.name,
      bio: data.bio,
      image: imageUrl,
      githubUrl: data.githubUrl,
      xUrl: data.xUrl,
      websiteUrl: data.websiteUrl,
      updatedAt: new Date(),
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    if (!updatedUser) {
      return { error: "ユーザー情報の更新に失敗しました" }
    }

    revalidatePath("/dashboard/settings")

    return { success: true, image: imageUrl }
  } catch (error) {
    console.error("ユーザー情報更新エラー:", error)
    return { error: "ユーザー情報の更新中にエラーが発生しました" }
  }
}
