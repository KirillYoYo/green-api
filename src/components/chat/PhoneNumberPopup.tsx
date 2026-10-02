import {useState} from 'react';
import {Popup} from "../ui/Popup.tsx";
import {useChatStore} from "../../store/chatStore.ts";
import {startChatService} from "../../services/chatService.ts";

interface PhoneNumberPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const PhoneNumberPopup = ({open, setOpen}: PhoneNumberPopupProps) => {

    const [formPhoneNumber, setFormPhoneNumber] = useState("");
    const setPhoneNumber = useChatStore((s) => s.setPhoneNumber)

    const onSuccess = () => {
        setPhoneNumber(formPhoneNumber)
        startChatService(Number(formPhoneNumber))
        setOpen(false)
    }

    return (
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
        </Popup>
    );
};

export default PhoneNumberPopup;