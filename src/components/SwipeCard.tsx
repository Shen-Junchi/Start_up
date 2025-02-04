"use client";

import { useState } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";


// CardData 定义了卡片数据的类型 以后的数据卡片必须按照这个思路去填写信息

interface CardData {
    id: number;
    title: string;
    content: string;
    source?: string;
    date?: string;
    aiInsight?: string; // 添加AI insight内容
    Pictsure?: string; // 添加图片内容
}

const SWIPE_THRESHOLD = 100;
const CARD_OFFSET = 20;

// 这部分代码是为了定义
export default function NewsCards() {
    const [cards, setCards] = useState<CardData[]>([
        {
            id: 1,
            title: "Insider Reveals Brooks Koepka Is a 'Maniac' Who Doesnt Care About Consequences as LIV Golf 2025 Inches...",
            content: "Golfer Brooks Koepka continues using a battered, original Nike Vapor Fly Pro 3-iron, despite damage and the availability of newer models. He reportedly doesn't care about potential consequences, leading a fellow golfer to call him a 'maniac.' This contrasts with other Nike-sponsored golfers who switched brands after Nike exited golf equipment manufacturing in 2016.",
            source: "essentiallysports.com",
            date: "Jan 10",
            aiInsight: "AI分析：Brooks Koepka的这种行为展现了他独特的个性和对器材的特殊依恋。从专业角度来看，这反映了运动员对自己熟悉装备的信赖度，但也带来了潜在的性能风险。这种行为可能影响其在LIV Golf 2025赛季的表现，特别是在高强度比赛中装备可靠性的考验。",
            Pictsure: "/picts/屏幕截图 2024-12-23 160522.png"
        },
        {
            id: 2,
            title: "Major Sports League Announces New TV Deal",
            content: "A groundbreaking television rights agreement has been reached...",
            source: "sportsnews.com",
            date: "Jan 9",
            aiInsight: "AI分析：这项电视转播权协议将对体育产业产生深远影响..."
        },
        {
            id: 3,
            title: "Rising Star Athletes to Watch in 2025",
            content: "Emerging talents across various sports are making waves...",
            source: "athleticreview.com",
            date: "Jan 8",
            aiInsight: "AI分析：新一代运动员的崛起预示着体育界的新变革..."
        },
    ]);

    console.log(cards);


    // 添加展开状态控制 也就是说 我这个部分储存了用户目前卡片的展开状态
    // expandedCard: number | null 表示当前展开的卡片ID，如果没有卡片展开，则为null
    // setExpandedCard: React.Dispatch<React.SetStateAction<number | null>> 是一个函数，用于更新 expandedCard 的状态
    const [expandedCard, setExpandedCard] = useState<number | null>(null);


    // 修改原有的 removeCard 函数
    const removeCard = (direction: "left" | "right") => {
        const cardToRemove = cards[0];
        setCards(prev => prev.slice(1));
        setRemovedCards(prev => [cardToRemove, ...prev]);
        setExpandedCard(null);
    };
    

    const handleDragEnd = (info: PanInfo) => {
        // 获取X轴方向的偏移量
        const offset = info.offset.x;

        // 判断偏移量是否超过阈值
        if (Math.abs(offset) > SWIPE_THRESHOLD) {
            // 根据偏移方向移除卡片
            // offset > 0 表示向右滑动
            // offset < 0 表示向左滑动            
            removeCard(offset > 0 ? "right" : "left");
        }
    };

    const toggleExpand = (cardId: number) => {
        setExpandedCard(expandedCard === cardId ? null : cardId);
    };

    const [removedCards, setRemovedCards] = useState<CardData[]>([]);

 // 添加恢复上一张卡片的函数
    const restoreLastCard = () => {
        if (removedCards.length > 0) {
            setCards(prev => [removedCards[0], ...prev]);
            setRemovedCards(prev => prev.slice(1));
            setExpandedCard(null);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="relative h-screen max-h-[700px] w-[480px]">
                <div className="absolute left-1/2 top-1/8 -translate-x-1/2 -translate-y-1/2 w-full">
                    <AnimatePresence mode="popLayout">
                        {cards.map((card, index) => (
                            index < 4 && (
                                <motion.div
                                    key={card.id}
                                    className="absolute left-0 w-full"
                                    initial={{
                                        y: 0,
                                        scale: 1 - index * 0.05,
                                        opacity: 1 - index * 0.2,
                                        translateY: index * CARD_OFFSET
                                    }}
                                    animate={{
                                        y: 0,
                                        scale: expandedCard === card.id ? 1 : 1 - index * 0.05,
                                        opacity: expandedCard === card.id ? 1 : 1 - index * 0.2,
                                        translateY: expandedCard === card.id ? 0 : index * CARD_OFFSET,
                                        zIndex: expandedCard === card.id ? 50 : cards.length - index,
                                    }}
                                    exit={{
                                        x: card.id % 2 === 0 ? 200 : -200,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        zIndex: expandedCard === card.id ? 50 : cards.length - index,
                                    }}
                                    drag={index === 0 && !expandedCard ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    dragMomentum={false}
                                    onDragEnd={(_, info) => handleDragEnd(info)}
                                >
                                    <div className={`w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                                        expandedCard === card.id ? 'scale-110' : ''
                                    }`}>
                                        {/* 头部图片区域 */}
                                        <div className="relative h-64 bg-gradient-to-b from-black/60 to-black/90">
                                            {card.Pictsure ? (
                                                <img 
                                                    src={card.Pictsure} 
                                                    alt={card.title}
                                                    className="w-full h-full object-cover absolute"
                                                />
                                            ) : (
                                                // 保持原有的渐变背景作为默认
                                                <div className="w-full h-full absolute bg-gradient-to-b from-black/60 to-black/90" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            <div className="absolute top-4 left-4 flex items-center space-x-2">
                                                <div className="bg-gray-800 text-xs text-white px-2 py-1 rounded">
                                                    {card.source}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 left-4 right-4">
                                                <h2 className="text-xl font-semibold text-white leading-tight">
                                                    {card.title}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* 内容区域 */}
                                        <div className="p-4 bg-white">
                                            <div className="text-sm text-gray-600 mb-2">
                                                {card.date}
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {card.content}
                                            </p>

                                        {/* AI Insight展开区域 */}
                                            <AnimatePresence>
                                                {expandedCard === card.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="mt-4 border-t pt-4"
                                                    >
                                                        
                                                        <h3 className="text-md font-semibold text-gray-800 mb-2">
                                                            AI Insights
                                                        </h3>
                                                        <p className="text-sm text-gray-700">
                                                            {card.aiInsight}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* 底部按钮区 */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <button
                                                    className={`flex items-center text-gray-600 text-sm ${removedCards.length === 0 ? 'opacity-50' : ''}`}
                                                    onClick={restoreLastCard}
                                                    disabled={removedCards.length === 0}
                                                >
                                                    <span className="mr-1">←</span>
                                                    Back
                                                </button>
                                                <button
                                                    className={`flex items-center text-gray-600 text-sm bg-gray-50 px-3 py-1 rounded-full
                                                         border-black/10
                                                        ${expandedCard === card.id ? 'bg-red-50 text-blue-600' : ''}`}
                                                    onClick={() => toggleExpand(card.id)}
                                                >
                                                    AI Insights
                                                    <span className="ml-1">{expandedCard === card.id ? '-' : '+'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>

                        {cards.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xl text-black">没有更多新闻了</p>
                            </div>
                        )}
        </div>
    );
}
