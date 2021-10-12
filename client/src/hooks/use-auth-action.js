import { useGoogleLogin } from "react-google-login";
import { useAuth } from "../context/auth-context";
import { authenticate } from "../utils/api-client";

export default function useAuthAction() {
  const user = useAuth();
  const { signIn } = useGoogleLogin({
    onSuccess: authenticate,
    clientId:
      "973952766363-nq7c9shdgmg54h3sr7in811keod65kis.apps.googleusercontent.com",
  });

  function handleAuthAction(authAction, data) {
    if (user) {
      authAction(data);
    } else {
      signIn();
    }
  }

  return handleAuthAction;
}
