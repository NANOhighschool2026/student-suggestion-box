const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", async function () {

    const email =
        document.getElementById("admin-id").value.trim();

    const password =
        document.getElementById("admin-password").value;


    if (email === "") {
        alert("이메일을 입력해주세요.");
        return;
    }

    if (password === "") {
        alert("비밀번호를 입력해주세요.");
        return;
    }


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;

    }


    alert("로그인되었습니다.");

    window.location.href = "admin.html";

});


// Enter 키로 로그인

["admin-id", "admin-password"].forEach(function (id) {

    document.getElementById(id).addEventListener("keydown", function (event) {

        if (event.key === "Enter" && !event.isComposing) {
            loginButton.click();
        }

    });

});