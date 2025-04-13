import Link from "next/link";
import Image from "next/image";

export default function AdventureMap() {
    const levels = [
        { id: 1, x: 400, y: 100 },
        { id: 2, x: 800, y: 200 },
        { id: 3, x: 200, y: 350 },
        { id: 4, x: 1100, y: 500 },
        { id: 5, x: 500, y: 650 },
        { id: 6, x: 900, y: 800 },
        { id: 7, x: 300, y: 950 },
        { id: 8, x: 1200, y: 1200 },
        { id: 9, x: 600, y: 1250 },
        { id: 10, x: 1000, y: 1400 },
    ];

    const checkpointSize = 100; // Kích thước mặc định của icon checkpoint

    // Generate the path data for the SVG
    const pathData = levels
        .map((level, index) => {
            const x = level.x;
            const y = level.y;
            return index === 0 ? `M ${x},${y}` : `L ${x},${y}`;
        })
        .join(" ");

    return (
        <div className="relative w-full h-screen overflow-y-scroll bg-green-900">
            {/* Forest Background */}
            <div
                className="absolute inset-0 bg-contain repeat-y bg-center opacity-50"
                style={{
                    backgroundImage: "url('/forest.jpg')",
                    height: `${levels[levels.length - 1].y + 200}px`,
                }}
            ></div>

            {/* Map Container */}
            <div className="relative z-10 flex justify-center items-start pt-10">
                <svg
                    width="1400"
                    height={levels[levels.length - 1].y + 100}
                    className="relative"
                >
                    {/* Path with texture */}
                    <defs>
                        <pattern
                            id="path-texture"
                            patternUnits="userSpaceOnUse"
                            width="100"
                            height="100"
                        >
                            <image
                                href="/path-texture.jpg"
                                x="0"
                                y="0"
                                width="200"
                                height="200"
                            />
                        </pattern>
                    </defs>
                    <path
                        d={pathData}
                        stroke="url(#path-texture)"
                        strokeWidth="30"
                        strokeLinecap="round"
                        fill="none"
                        className="animate-draw"
                    />

                    {/* Level Checkpoints */}
                    {levels.map((level) => (
                        <g key={level.id}>
                            <Link href={`/Chess1v1/${level.id}`}>
                                <image
                                    href="/checkpoint.png" // Fire icon
                                    x={level.x - checkpointSize / 2}
                                    y={level.y - checkpointSize / 2}
                                    width={checkpointSize}
                                    height={checkpointSize}
                                    className="checkpoint-icon cursor-pointer"
                                />
                            </Link>
                            <text
                                x={level.x}
                                y={level.y + checkpointSize / 2 + 30}
                                textAnchor="middle"
                                fill="#FFF"
                                fontSize="20"
                                fontWeight="bold"
                                className="drop-shadow-md"
                            >
                                Level {level.id}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Decorative Forest Elements */}
            <div className="absolute z-20">
                {/* Trees */}
                <Image
                    src="/tree.png"
                    alt="Tree"
                    width={150}
                    height={200}
                    className="absolute top-20 left-20"
                />
                <Image
                    src="/tree.png"
                    alt="Tree"
                    width={150}
                    height={200}
                    className="absolute top-300 left-50"
                />
                <Image
                    src="/tree.png"
                    alt="Tree"
                    width={150}
                    height={200}
                    className="absolute top-600 right-20"
                />

                {/* Rocks around each checkpoint */}
                {levels.map((level) => (
                    <g key={`rocks-${level.id}`}>
                        <Image
                            src="/rock.png"
                            alt="Rock"
                            width={50}
                            height={50}
                            className="absolute"
                            style={{
                                top: `${level.y - 60}px`,
                                left: `${level.x - 80}px`,
                            }}
                        />
                        <Image
                            src="/rock.png"
                            alt="Rock"
                            width={50}
                            height={50}
                            className="absolute"
                            style={{
                                top: `${level.y - 60}px`,
                                left: `${level.x + 30}px`,
                            }}
                        />
                        <Image
                            src="/rock.png"
                            alt="Rock"
                            width={50}
                            height={50}
                            className="absolute"
                            style={{
                                top: `${level.y + 60}px`,
                                left: `${level.x - 60}px`,
                            }}
                        />
                    </g>
                ))}
            </div>

            <Link
                href="/GameCollection"
                className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out z-10"
            >
                ← Return
            </Link>
        </div>
    );
}