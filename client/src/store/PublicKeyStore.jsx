import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const usePublicKeyStore = create(
    persist(
        (set) => ({
            publicKeyData: {
                n: '',
                g: '',
            },
            setPublicKeyData: (data) => set({ publicKeyData: {...data} }),
        }),
        {
            name: 'publickey-store',
        }
    )
);

export default usePublicKeyStore;