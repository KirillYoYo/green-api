import React from 'react';

export interface LizardProps {
    /** Размер в пикселях (ширина = высота). По умолчанию 320. */
    size?: number;
    /** Множитель скорости перебирания лапок. 1 = обычная, 2 = вдвое быстрее. */
    speed?: number;
    /** Выключить анимацию (статуя). */
    animated?: boolean;
    /** Доп. класс для внешней стилизации. */
    className?: string;
    /** Доп. инлайн-стили на корневой <svg>. */
    style?: React.CSSProperties;
}

export const Lizard: React.FC<LizardProps> = ({
                                                  size = 180,
                                                  speed = 1,
                                                  animated = true,
                                                  className,
                                                  style,
                                              }) => {
    // Длительность шага: базовые 0.35s / speed
    const stepDuration = `${(0.35 / Math.max(speed, 0.01)).toFixed(3)}s`;
    const bobDuration  = `${(0.35 / Math.max(speed, 0.01)).toFixed(3)}s`;

    return (
        <>
            <style>{`
        .lizard-svg {
          display: block;
          overflow: visible;
        }

        /* Лёгкий подскок всего тела */
        .lizard-svg .lizard-bob {
          transform-box: view-box;
          transform-origin: 36px 45px;
        }
        .lizard-svg.lizard-animated .lizard-bob {
          animation: lizard-bob ${bobDuration} ease-in-out infinite alternate;
        }
        @keyframes lizard-bob {
          from { transform: translateY(0)      rotate(-1.5deg); }
          to   { transform: translateY(-1.5px) rotate( 1.5deg); }
        }

        /* Общая настройка для лапок */
        .lizard-svg .lizard-leg {
          transform-box: view-box;
        }

        /* ПЕРЕДНЯЯ ЛАПКА — ось в верхней точке крепления (19, 43) */
        .lizard-svg .lizard-leg-front {
          transform-origin: 19px 43px;
        }
        .lizard-svg.lizard-animated .lizard-leg-front {
          animation: lizard-step-front ${stepDuration}
                     cubic-bezier(.4, 0, .2, 1) infinite alternate;
        }
        @keyframes lizard-step-front {
          0%   { transform: rotate(-35deg); }
          100% { transform: rotate( 35deg); }
        }

        /* ЗАДНЯЯ ЛАПКА — ось в верхней точке крепления (~36.5, 46.5), противофаза */
        .lizard-svg .lizard-leg-back {
          transform-origin: 36.5px 46.5px;
        }
        .lizard-svg.lizard-animated .lizard-leg-back {
          animation: lizard-step-back ${stepDuration}
                     cubic-bezier(.5, -0.4, .5, 1.4) infinite alternate;
        }
        @keyframes lizard-step-back {
          0%   { transform: rotate( 35deg); }
          100% { transform: rotate(-35deg); }
        }

        /* Уважаем настройку "уменьшить движение" */
        @media (prefers-reduced-motion: reduce) {
          .lizard-svg.lizard-animated .lizard-bob,
          .lizard-svg.lizard-animated .lizard-leg-front,
          .lizard-svg.lizard-animated .lizard-leg-back {
            animation: none;
          }
        }
      `}</style>

            <svg
                className={[
                    'lizard-svg',
                    animated ? 'lizard-animated' : '',
                    className ?? '',
                ].join(' ').trim()}
                width={size}
                height={size}
                viewBox="0 0 72 72"
                xmlns="http://www.w3.org/2000/svg"
                style={style}
                role="img"
                aria-label="Ящерица"
            >
                <g className="lizard-bob">
                    <g id="color">
                        <path
                            fill="#B1CC33"
                            stroke="none"
                            d="M39.9167,47.3583c0,0,7.8819-2.3583,13.9826-0.8583S68,46,68,46s-7.6667,0.6667-15.3333-3.6667 S39,40.8333,32.5,40.4167c-6.5-0.4167-14.1667-4.5833-17.8333-7C11,31,8.5833,31.25,8.5833,31.25S8,32,6,33s-5,2,1,4 s8.8333,5.8333,8.8333,5.8333S21.8333,48.8583,39.9167,47.3583z"
                        />
                    </g>
                    <g id="hair" />
                    <g id="skin" />
                    <g id="skin-shadow" />
                    <g id="line">
                        <path
                            fill="none"
                            stroke="#000000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={2}
                            d="M39.9167,46.5c0,0,7.8819-1.5,13.9826,0S68,46,68,46s-7.6667,0.6667-15.3333-3.6667S39,40.8333,32.5,40.4167 c-6.5-0.4167-14.1667-4.5833-17.8333-7C11,31,8.5833,31.25,8.5833,31.25S8,32,6,33s-5,2,1,4s8.8333,4.8333,8.8333,4.8333"
                        />
                        <path
                            fill="none"
                            stroke="#000000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={2}
                            d="M21.387,45.0264c0,0,5.7159,1.8069,10.613,1.3902"
                        />

                        {/* ПЕРЕДНЯЯ ЛАПКА */}
                        <g className="lizard-leg lizard-leg-front">
                            <line
                                x1={19} x2={16} y1={43} y2={50}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                            <line
                                x1={16} x2={15} y1={48} y2={48}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                            <line
                                x1={17} x2={18} y1={48} y2={49}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                        </g>

                        {/* ЗАДНЯЯ ЛАПКА */}
                        <g className="lizard-leg lizard-leg-back">
                            <line
                                x1={36.5466} x2={36.0791} y1={46.5061} y2={53.3712}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                            <line
                                x1={35.4177} x2={34.4902} y1={51.7302} y2={52.104}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                            <line
                                x1={36.3451} x2={37.6034} y1={51.3563} y2={51.803}
                                fill="none" stroke="#000000"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeMiterlimit={10} strokeWidth={2}
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </>
    );
};

export default Lizard;