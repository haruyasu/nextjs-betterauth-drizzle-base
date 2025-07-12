"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithGoogle } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"

const Login = () => {
  const googleLoginMutation = useMutation({
    mutationFn: () => {
      return signInWithGoogle()
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate()
  }

  return (
    <div className="flex items-center justify-center mt-32 px-2">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-lg">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-center">Please login with Google account</p>
            <Button
              type="button"
              className="w-full"  
              onClick={handleGoogleLogin}
              disabled={googleLoginMutation.isPending}
            >
              {googleLoginMutation.isPending ? (
                <div>Loading...</div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FcGoogle />
                  Login with Google
                </div>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm">
          <p>
            If you don&apos;t have an account, it will be automatically created
            when you login with Google.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
