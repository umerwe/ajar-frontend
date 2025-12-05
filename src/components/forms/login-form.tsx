"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Login, LoginSchema } from "@/validations/auth"
import { useLogin } from "@/hooks/useAuth"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import Footer from "../auth/footer"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  })

  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const { mutate, isPending } = useLogin()

  const onSubmit = (formData: Login) => {
    mutate(formData)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl px-4 py-8 sm:p-8 w-full lg:w-[120%]">
      <Header
        title="Welcome Back!"
        description="Let's create new account to explore more"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${errors.email || errors.password ? "space-y-3" : "space-y-5"
          }`}
      >
        <Input
          label="Email or Phone Number"
          type="email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="h-4 w-4 text-aqua focus:ring-aqua border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-600">Keep me signed in</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-aqua hover:text-teal-600 font-medium"
          >
            Forgot password
          </Link>
        </div>

        <Button text="Sign In" isPending={isPending} />

        {/* 👇 Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* 👇 Google login button */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition-all"
        >
          <FcGoogle className="text-2xl" />
          <span className="text-gray-700 text-sm font-medium">
            Sign in with Google
          </span>
        </button>
      </form>

      <Footer
        linkHref="/auth/signup"
        linkText="Sign up here"
        messageText="Don't have an account?"
      />
    </div>
  )
}

export default LoginForm
