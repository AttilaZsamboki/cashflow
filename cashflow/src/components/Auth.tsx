import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./SubmitButton";

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Button
        onClick={sessionData ? () => signOut() : () => signIn()}
        text={sessionData ? "Sign out" : "Sign in"}
      />
    </div>
  );
};

export default Auth;
