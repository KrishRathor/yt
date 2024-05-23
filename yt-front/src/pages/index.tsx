
import { api } from "@/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const registerUser = api.user.registerUser.useMutation({
    onSuccess: (data) => {
      console.log(data);
    }
  });

  const loginUser = api.user.login.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  return (
    <div className="text-black " >
      hi there

      <button onClick={() => loginUser.mutate({
        email: 'email',
        password: 'ass',
      })} >click</button>

    </div>
  );
}
