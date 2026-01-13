const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

try {
  initializeApp();
} catch {
  // 이미 초기화된 경우 무시
}

const db = getFirestore();
const APP_ID = "1:985016521498:web:51baf8fc15558c9ccf12a3";

exports.finishSession = onCall(
  { region: "us-central1", cors: true, enforceAppCheck: true },
  async (request) => {
    const auth = request && request.auth ? request.auth : null;
    const app = request && request.app ? request.app : null;
    const data = request ? request.data : null;

    console.log(
      "finishSession ctx",
      {
        hasAuth: !!(auth && auth.uid),
        uid: auth && auth.uid ? auth.uid : null,
        hasApp: !!(app && app.appId),
        appId: app && app.appId ? app.appId : null,
        bodyKeys: data ? Object.keys(data) : [],
      }
    );

    if (!auth || !auth.uid) {
      throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    }

    const userId = auth.uid;
    const userNameRaw = data && data.userName
      ? String(data.userName).trim()
      : "";
    const safeUserName = userNameRaw
      ? userNameRaw.slice(0, 20)
      : "익명_" + userId.slice(0, 6);

    const isPartial = !!(
      data && data.sessionMeta && data.sessionMeta.isPartial
    );
    const mode = (data && data.sessionMeta && data.sessionMeta.mode)
      ? String(data.sessionMeta.mode)
      : "all";

    const clientScore = (
      data && data.clientHint && data.clientHint.clientScore != null
    )
      ? Number(data.clientHint.clientScore)
      : 0;
    const clientQuestionsEngaged = (
      data && data.clientHint && data.clientHint.questionsEngaged != null
    )
      ? Number(data.clientHint.questionsEngaged)
      : 0;
    const clientTotalQuestions = (
      data && data.clientHint && data.clientHint.totalQuestions != null
    )
      ? Number(data.clientHint.totalQuestions)
      : 0;
    const clientPercentage = (
      data && data.clientHint && data.clientHint.percentage != null
    )
      ? Number(data.clientHint.percentage)
      : 0;

    const colRef = db
      .collection("artifacts")
      .doc(APP_ID)
      .collection("public")
      .doc("data")
      .collection("allDaysRankings");

    const nowIso = new Date().toISOString();
    const rankingDoc = {
      userId: userId,
      userName: safeUserName,
      score: clientScore,
      mode: mode,
      isPartial: isPartial,
      questionsAttemptedInSession: clientQuestionsEngaged || null,
      totalQuestions: clientTotalQuestions || null,
      percentage: clientPercentage || null,
      completedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      clientTime: nowIso,
    };

    try {
      await colRef.add(rankingDoc);
      const msg = isPartial
        ? "중간 결과가 랭킹에 기록되었습니다."
        : "랭킹에 기록되었습니다!";
      return { success: true, message: msg };
    } catch (err) {
      console.error("finishSession write error:", err);
      throw new HttpsError("internal", "서버 오류로 기록하지 못했습니다.");
    }
  }
);