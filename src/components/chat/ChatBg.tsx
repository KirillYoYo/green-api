const ChatBg = () => {

    return (
        <div className="pointer-events-none absolute inset-0 w-full h-full z-0">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {/* Линейный градиент для полосы */}
                    <linearGradient id="ai-shine" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
                        <stop offset="45%" stopColor="rgba(255,255,255,0)"/>
                        <stop offset="49%" stopColor="rgba(255,255,255,0.7)"/>
                        <stop offset="50%" stopColor="rgba(255,255,255,0.9)"/>
                        <stop offset="51%" stopColor="rgba(255,255,255,0.6)"/>
                        <stop offset="55%" stopColor="rgba(255,255,255,0)"/>
                        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </linearGradient>

                    {/* Маска с двумя диагональными полосами */}
                    <mask id="ai-shine-mask">
                        <rect x="0" y="0" width="400" height="300" fill="black"/>

                        {[0, 1].map((idx) => (
                            <rect
                                key={idx}
                                x={idx === 0 ? -200 : 0}
                                y={200}
                                width={400}
                                height={320}
                                fill="url(#ai-shine)"
                                transform="rotate(-45 200 150)"
                            >
                                <>
                                    <animate
                                        attributeName="x"
                                        from={idx === 0 ? -200 : 0}
                                        to="200"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="y"
                                        from="250"
                                        to="-50"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </>
                            </rect>
                        ))}
                    </mask>
                </defs>

                {/* Тёмный текст-фон */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Concert One', Arial, sans-serif"
                    fontSize={70}
                    fontWeight={700}
                    fill="#172443" // 0f172b
                    opacity={0.2}
                >
                    GREEN
                </text>

                {/* Та же надпись с маской бегущей полосы */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Concert One', Arial, sans-serif"
                    fontSize={70}
                    fontWeight={700}
                    fill="white"
                    mask="url(#ai-shine-mask)"
                >
                    GREEN
                </text>
            </svg>
        </div>
    )
}

export default ChatBg