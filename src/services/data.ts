import { db } from "./firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export class DataService {
    /**
     * Fetch all sessions for a given user ID
     */
    static async getUserSessions(uid: string) {
        try {
            const sessionsRef = collection(db, "users", uid, "sessions");
            const q = query(sessionsRef, orderBy("createdAt", "desc"));

            const querySnapshot = await getDocs(q);
            const sessions = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return sessions;
        } catch (error) {
            console.error("Error fetching sessions:", error);
            return [];
        }
    }
}
