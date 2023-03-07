import { DarkContext } from "@/context/DarkContext";
import { useState, useEffect, useRef, useContext } from "react";


const Container = () => {

    const { darkMode, toggleDarkMode }: any = useContext(DarkContext);

    const scrollContainer = useRef(null);

    const [messageText, setMessageText] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [userChat, setUserChat] = useState<string[]>([]);
    const [botChat, setBotChat] = useState<string[]>([]);


    const [isDark, setIsDark] = useState("light");

    const botResponse = async () => {
        setIsLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messageText,
            }),
        });
        console.log("Edge function returned.");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let botReply = "";

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const botMessage = decoder.decode(value);
            botReply += botMessage;
        }
        botReply += "\n";
        setBotChat([...botChat, botReply]);
        setIsLoading(false);
    }

    const handleScroll = (ref: any) => {
        ref.scrollTo({
            top: ref.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    };

    const sendMessage = () => {
        if ((messageText.trim().length !== 0)) {
            botResponse();
        }
        setUserChat((messageText.trim().length === 0) ? userChat : [...userChat, messageText]);

        setMessageText("");
    }

    const handleEnterKey = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
        }
    }

    useEffect(() => {
        handleScroll(scrollContainer.current);
    }, [messageText, botChat])

    return (
        <div className={`bg-${darkMode}`}>
            <div className="flex gap-8 items-center justify-center">
                <h1 className={`text-${darkMode} py-4 text-2xl  font-bold  text-center py-7`}>Next.js With ChatGPT</h1>
                <input
                    className="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[rgba(120,120,120,0.25)] outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-sky-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    onClick={() => toggleDarkMode()}
                />
            </div>
            <div className={`container-bg-${darkMode}`}>
                <div className='container mx-auto px-12 max-sm:px-6 py-6 overflow-auto h-[80vh] chat-container' ref={scrollContainer}>
                    {userChat.map((ele, key) => {
                        return (
                            <div key={`blockchat-${key}`}>
                                <div key={`userchat-${key}`} className='flex flex-col gap-2 items-end justify-center'>
                                    <div className={`input-user-chat-bg-${darkMode} input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] break-words`}>{ele}</div>
                                </div>
                                {botChat[key] && <div key={`botchat-${key}`} className='flex flex-col gap-2 items-start justify-center break-words'>
                                    <div className={`input-bot-chat-bg-${darkMode} input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%]`}>
                                        {botChat[key].split("\n").map((ele: any, indkey: any) => {
                                            return <p key={`indkey-${indkey}`}>{ele}</p>
                                        })}</div>
                                </div>}
                            </div>
                        )
                    })}
                    {isLoading && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
                </div>
            </div>

            <div className='container mx-auto px-12 max-sm:px-2 flex justify-center '>
                <div className="relative w-1/2 flex items-start py-6 max-xl:w-full flex justify-center max-md:flex-col max-md:items-center gap-4">
                    <textarea value={messageText} onChange={e => setMessageText(e.target.value)} onKeyUp={handleEnterKey}
                        className={`input-bg-${darkMode} rounded-lg outline-none  border input-border-${darkMode} input-text-${darkMode} w-full h-14 px-6 py-3 resize-none`}
                        placeholder="PLEASE TYPE YOUR TEXT HERE ..." />
                    <button className={`button-bg-${darkMode} rounded-lg text-white text-3xl font-black px-6 py-2 active:translate-y-1`} onClick={sendMessage}>
                        Send
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Container;