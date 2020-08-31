import React from "react";

let Page = (props) => {
    return (
      <form method={"post"} action={"/php/changePassword.php"}>
          <input type={"text"} name={"password"} />
      </form>
    );
}

export default Page;