import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,

    fetchUserInfo: async (uid) => {

        if (!uid) return set({ currentUser: null, isLoading: false });

        try {

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                //console.log("User data:", docSnap.data());
                return set({ currentUser: docSnap.data(), isLoading: false });

            } else {
                //console.log("No such document!");
                return set({ currentUser: null, isLoading: false });
            }


        }
        catch (err) {
            console.log(err);
            return set({ currentUser: null, isLoading: false });

        }
    }

}))