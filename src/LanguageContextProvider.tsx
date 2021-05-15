import React, {createContext, useState} from 'react';

const Context = createContext<{language: "en" | "de", setLanguage: React.Dispatch<React.SetStateAction<"de" | "en">>} | null>(null);

const LanguageContextProvider = (props: any) => {
    const [language, setLanguage] = useState<"de" | "en">("en");
    return (
        <Context.Provider
            value={{
                language, setLanguage
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export {Context as LanguageContext, LanguageContextProvider};