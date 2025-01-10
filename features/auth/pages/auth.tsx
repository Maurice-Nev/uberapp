"use server";

import AuthForm from "../components/authForm";

export default async function Auth() {
  return (
    <div className="w-full flex justify-center items-center pt-16 ">
      <AuthForm />
    </div>
  );
}
