"use client"

// データが存在しないときの画面
const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center text-5xl font-bold mb-3">404</div>
      <div className="text-center text-xl font-bold">Not Found</div>
    </div>
  )
}

export default NotFound
