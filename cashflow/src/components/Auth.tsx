import { signIn, signOut, useSession } from "next-auth/react";
import SubmitButton from "./SubmitButton";

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <SubmitButton
        onClick={sessionData ? () => signOut() : () => signIn()}
        title={sessionData ? "Sign out" : "Sign in"}
      />
    </div>
  );
};

export default Auth;
