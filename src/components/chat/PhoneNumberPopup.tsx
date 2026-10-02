import {type Dispatch, type SetStateAction, useState} from 'react';
import {Popup} from "../ui/Popup.tsx";
import {useChatStore} from "../../store/chatStore.ts";
import {startChatService} from "../../services/chatService.ts";
import Lizard from "../lizard.tsx";
import {createPortal} from "react-dom";

interface PhoneNumberPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setIstartLoading: Dispatch<SetStateAction<boolean>>;
    setIEndLoading: Dispatch<SetStateAction<boolean>>;
}

const PhoneNumberPopup = ({open, setOpen, setIstartLoading, setIEndLoading}: PhoneNumberPopupProps) => {

    const [formPhoneNumber, setFormPhoneNumber] = useState("");
    const setPhoneNumber = useChatStore((s) => s.setPhoneNumber)

    const onSuccess = async () => {
        setIstartLoading(true);
        setPhoneNumber(formPhoneNumber)
        await startChatService(Number(formPhoneNumber))
        setIEndLoading(true)
        setOpen(false)
    }

    return [
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            title="Введите номер"
            footer={
                <>
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg border px-4 py-2"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onSuccess}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        Подтвердить
                    </button>
                </>
            }
        >
            <div>
                <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="7 999 123 45 67"
                    value={formPhoneNumber}
                    onChange={(e) => setFormPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-7 pr-3 py-2 text-sm
               placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition-colors"
                />
            </div>
            {createPortal(
                <div style={{ position: 'fixed', bottom: 0, right: 20, zIndex: 9999 }}>
                    <Lizard />
                </div>,
                document.body
            )}
        </Popup>,
    ];
};

export default PhoneNumberPopup;