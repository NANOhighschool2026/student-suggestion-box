const blockedWords = [
    "씨발",
    "시발",
    "병신",
    "개새끼",
    "ㅅㅂ",
    "ㅄ",
    "fuck",
    "shit"
];

function containsInappropriateExpression(text) {

    const normalizedText =
        text
            .toLowerCase()
            .replace(/[\s\-_.,!?~'"“”‘’()[\]{}]/g, "");

    return blockedWords.some(function (word) {
        return normalizedText.includes(word.toLowerCase());
    });
}


const anonymousCheckbox =
    document.getElementById("anonymous");

const nameInput =
    document.getElementById("name");


// 익명 체크

anonymousCheckbox.addEventListener("change", function () {

    if (anonymousCheckbox.checked) {

        nameInput.value = "";
        nameInput.disabled = true;

    } else {

        nameInput.disabled = false;

    }

});


// 제출 버튼

const submitButton =
    document.querySelector(".submit-button");


submitButton.addEventListener("click", async function () {

    const name =
        nameInput.value.trim();

    const title =
        document.getElementById("title").value.trim();

    const content =
        document.getElementById("content").value.trim();


    // 입력 확인

    if (!anonymousCheckbox.checked && name === "") {

        alert("이름을 입력해주세요.");
        nameInput.focus();

        return;

    }


    if (title === "") {

        alert("제목을 입력해주세요.");
        document.getElementById("title").focus();

        return;

    }


    if (content === "") {

        alert("내용을 입력해주세요.");
        document.getElementById("content").focus();

        return;

    }


    // 부적절한 표현 검사

    if (
        containsInappropriateExpression(name) ||
        containsInappropriateExpression(title) ||
        containsInappropriateExpression(content)
    ) {

        alert("부적절한 표현이 포함되어 있습니다. 내용을 수정해주세요.");

        return;

    }


    // 제출 확인

    const result =
        confirm("건의사항을 제출하시겠습니까?");

    if (!result) {

        return;

    }


    // 여기서부터 제출 중

    submitButton.disabled = true;
    submitButton.textContent = "제출 중...";


    // 익명이면 이름을 익명으로 저장

    const submitName =
        anonymousCheckbox.checked
            ? "익명"
            : name;


    // Supabase에 저장

    const { data, error } =
        await supabaseClient
            .from("suggestions")
            .insert([
                {
                    name: submitName,
                    title: title,
                    content: content,
                    status: "waiting"
                }
            ]);


    // 저장 실패

    if (error) {

        console.error(error);

        alert("건의사항 제출에 실패했습니다.");

        submitButton.disabled = false;
        submitButton.textContent = "건의사항 제출";

        return;

    }


    // 저장 성공

    alert("건의사항이 제출되었습니다.");


    // 입력창 초기화

    nameInput.value = "";

    document.getElementById("title").value = "";

    document.getElementById("content").value = "";

    anonymousCheckbox.checked = false;

    nameInput.disabled = false;


    // 버튼 원상복구

    submitButton.disabled = false;
    submitButton.textContent = "건의사항 제출";

});