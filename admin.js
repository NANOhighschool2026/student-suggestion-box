let currentCard = null;
let currentSuggestionId = null;
let currentFilter = "all";
function formatDate(createdAt) {

    const timestamp = Number(createdAt);

    if (Number.isFinite(timestamp)) {
        return new Date(timestamp * 1000).toLocaleDateString("ko-KR");
    }

    return new Date(createdAt).toLocaleDateString("ko-KR");
}
supabaseClient.auth.getSession().then(async function (result) {

    const session = result.data.session;

    if (!session) {
        window.location.href = "admin-login.html";
        return;
    }


    // 관리자 명단(admins 표)에 있는 계정인지 확인

    const { data, error } =
        await supabaseClient
            .from("admins")
            .select("user_id");

    if (error) {

        console.error(error);

        alert("관리자 확인에 실패했습니다.");

        return;

    }

    if (data.length === 0) {

        alert("관리자 명단에 없는 계정입니다.");

        await supabaseClient.auth.signOut();

        window.location.href = "admin-login.html";

        return;

    }

    loadSuggestions();
});


// 건의사항 불러오기

async function loadSuggestions() {

    const { data, error } = await supabaseClient
        .from("suggestions")
        .select("*")
        .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        alert("건의사항을 불러오지 못했습니다.");

        return;

    }
// 통계 계산

const totalCount =
    document.getElementById("total-count");

const waitingCount =
    document.getElementById("waiting-count");

const completeCount =
    document.getElementById("complete-count");


const total =
    data.length;

const waiting =
    data.filter(function (suggestion) {
        return suggestion.status === "waiting";
    }).length;

const complete =
    data.filter(function (suggestion) {
        return suggestion.status === "complete";
    }).length;


totalCount.textContent = total;
waitingCount.textContent = waiting;
completeCount.textContent = complete;
    const suggestionList =
        document.querySelector(".suggestion-list");


    // 기존 테스트 카드 제거

    const oldCards =
        suggestionList.querySelectorAll(".suggestion-card");

    oldCards.forEach(function (card) {
        card.remove();
    });


    // DB 데이터 표시
const filteredData =
    currentFilter === "all"
        ? data
        : data.filter(function (suggestion) {
            return suggestion.status === currentFilter;
        });
    filteredData.forEach(function (suggestion) {

        const card =
            document.createElement("article");

        card.className = "suggestion-card";


        card.dataset.title =
            suggestion.title;

        card.dataset.info =
    `${suggestion.name} · ${formatDate(suggestion.created_at)}`;
        card.dataset.content =
            suggestion.content;

        card.dataset.status =
            suggestion.status;


        const suggestionInfo =
    document.createElement("div");

suggestionInfo.className = "suggestion-info";


const titleElement =
    document.createElement("h3");

titleElement.textContent =
    suggestion.title;


const infoElement =
    document.createElement("p");

infoElement.textContent =
    `${suggestion.name} · ${formatDate(suggestion.created_at)}`;


suggestionInfo.appendChild(titleElement);
suggestionInfo.appendChild(infoElement);


const statusElement =
    document.createElement("span");

statusElement.className =
    "status " +
    (suggestion.status === "complete"
        ? "complete"
        : "waiting");

statusElement.textContent =
    suggestion.status === "complete"
        ? "처리 완료"
        : "처리 대기";


card.appendChild(suggestionInfo);
card.appendChild(statusElement);


        suggestionList.appendChild(card);


        // 카드 클릭

        card.addEventListener("click", function () {

            currentCard = card;
currentSuggestionId = suggestion.id;
            detailTitle.textContent =
                suggestion.title;

           detailInfo.textContent =
    `${suggestion.name} · ${formatDate(suggestion.created_at)}`;
            detailContent.textContent =
                suggestion.content;

               if (suggestion.status === "complete") {

    detailStatus.textContent = "처리 완료";

    completeButton.textContent = "처리 완료됨";
    completeButton.disabled = true;

} else {

    detailStatus.textContent = "처리 대기";

    completeButton.textContent = "처리 완료";
    completeButton.disabled = false;

}
            detailOverlay.classList.add("active");

        });

    });

}


// 상세보기 요소

const detailOverlay =
    document.getElementById("detail-overlay");

const detailClose =
    document.getElementById("detail-close");

const detailTitle =
    document.getElementById("detail-title");

const detailInfo =
    document.getElementById("detail-info");

const detailContent =
    document.getElementById("detail-content");
const completeButton =
    document.getElementById("complete-button");
const detailStatus =
    document.getElementById("detail-status");
const deleteButton =
    document.getElementById("delete-button");
const logoutButton =
    document.getElementById("logout-button");

logoutButton.addEventListener("click", async function () {

    const result =
        confirm("로그아웃하시겠습니까?");

    if (!result) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        alert("로그아웃에 실패했습니다.");
        return;
    }

    window.location.href = "admin-login.html";
});
completeButton.addEventListener("click", async function () {

    if (currentSuggestionId === null) {
        return;
    }

    const result =
        confirm("이 건의사항을 처리 완료로 변경하시겠습니까?");

    if (!result) {
        return;
    }


    // 권한이 없으면 오류 없이 0건만 바뀌므로 바뀐 줄을 받아 확인

    const { data, error } =
        await supabaseClient
            .from("suggestions")
            .update({
                status: "complete"
            })
            .eq("id", currentSuggestionId)
            .select();


    if (error || data.length === 0) {

        console.error(error || "바뀐 건의사항이 없습니다.");

        alert("처리 완료 변경에 실패했습니다.");

        return;

    }


    alert("처리 완료로 변경되었습니다.");

    detailOverlay.classList.remove("active");

    loadSuggestions();

});
deleteButton.addEventListener("click", async function () {

    if (currentSuggestionId === null) {
        return;
    }

    const result =
        confirm("이 건의사항을 정말 삭제하시겠습니까?");

    if (!result) {
        return;
    }

    const { data, error } =
        await supabaseClient
            .from("suggestions")
            .delete()
            .eq("id", currentSuggestionId)
            .select();

    if (error || data.length === 0) {
        console.error(error || "삭제된 건의사항이 없습니다.");
        alert("건의사항 삭제에 실패했습니다.");
        return;
    }

    alert("건의사항이 삭제되었습니다.");

    detailOverlay.classList.remove("active");

    loadSuggestions();
});
// 닫기

detailClose.addEventListener("click", function () {

    detailOverlay.classList.remove("active");

});


// 바깥쪽 클릭

detailOverlay.addEventListener("click", function (event) {

    if (event.target === detailOverlay) {

        detailOverlay.classList.remove("active");

    }

});

const filterButtons =
    document.querySelectorAll(".filter-button");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter =
            button.dataset.filter;

        filterButtons.forEach(function (otherButton) {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");

        loadSuggestions();
    });

});
