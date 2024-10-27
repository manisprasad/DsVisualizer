import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

const QueueVisualizer: React.FC = () => {
    const [size, setSize] = useState<number>(5); // Queue size
    const [queue, setQueue] = useState<string[]>([]); // Queue elements
    const [isPopping, setIsPopping] = useState<boolean>(false); // Track pop animation
    const inputRef = useRef<HTMLInputElement>(null); // Input reference
    const lastElementRef = useRef<HTMLDivElement>(null); // Last element reference for scrolling
    const frontElementRef = useRef<HTMLDivElement>(null); // Reference for the new front element after dequeue

    const queueContainerRef = useRef<HTMLDivElement>(null); // Queue container ref for scrolling
    const indexContainerRef = useRef<HTMLDivElement>(null); // Index container ref for synchronized scrolling

    const isFull = queue.length === size;
    const isEmpty = queue.length === 0;
    const toastDuration = 700;

    const scrollToView = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const enqueue = (item: string): void => {
        if (isFull) {
            toast.error("Queue Overflow", { duration: toastDuration });
            return;
        }
        if (!item) {
            toast.error("Please Enter Value", { duration: toastDuration });
            return;
        }
        setQueue((prev) => [...prev, item]);
        setTimeout(() => scrollToView(lastElementRef), 100); // Scroll to last enqueued element
        if (inputRef.current) inputRef.current.value = ""; // Clear input
    };

    const dequeue = (): void => {
        if (isEmpty) {
            toast.error("Queue Underflow Error", { duration: toastDuration });
            return;
        }
        setIsPopping(true);
        setTimeout(() => {
            const dequeuedElement = queue[0]; // Get the front element
            setQueue((prev) => prev.slice(1)); // Remove the front element
            toast.success(`Element dequeued: ${dequeuedElement}`, { duration: toastDuration });
            setIsPopping(false);
        }, 500);
    };

    useEffect(() => {
        // Scroll to the new front element after a dequeue operation
        if (queue.length > 0 && !isPopping) {
            scrollToView(frontElementRef);
        }
    }, [queue, isPopping]);

    // Sync scrolling between queue and index containers
    useEffect(() => {
        const syncScroll = () => {
            if (queueContainerRef.current && indexContainerRef.current) {
                indexContainerRef.current.scrollLeft = queueContainerRef.current.scrollLeft;
            }
        };

        if (queueContainerRef.current) {
            queueContainerRef.current.addEventListener("scroll", syncScroll);
        }

        return () => {
            if (queueContainerRef.current) {
                queueContainerRef.current.removeEventListener("scroll", syncScroll);
            }
        };
    }, []);

    const peek = (): void => {
        if (isEmpty) {
            toast.error("Queue is Empty", { duration: toastDuration });
        } else {
            toast.success(`Front Element: ${queue[0]}`, { duration: toastDuration });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-5">
            <h1 className=" font-semibold text-2xl">Queue Visualizer</h1>
            <Toaster />

            <div className="flex flex-col box-border w-full items-center">
                {/* Queue Display */}
                <div
                    ref={queueContainerRef}
                    className="flex gap-1 flex-row-reverse relative border-2 border-black mb-2 border-x-0 w-11/12 p-2 h-52 overflow-x-scroll">
                    {queue.map((num: string, index) => (
                        <div
                            key={index}
                            ref={index === queue.length - 1 ? lastElementRef : index === 0 ? frontElementRef : null}
                            className={`bg-blue-200 text-center fit-text py-2 px-4 min-w-[64px] w-16 rounded-lg shadow-md text-blue-800 font-semibold flex items-center justify-center ${isPopping && index === 0 ? "popping" : ""}`}
                        >
                            {isPopping && index === 0 ? <MdDeleteForever
                                className="text-red-500"/> : num.length > 10 ? num.slice(0, 9) + '...' : num}
                        </div>
                    ))}
                </div>

                {/* Index Display */}
                <div
                    ref={indexContainerRef}
                    className="flex gap-1 flex-row-reverse relative mb-2 border-x-0 w-11/12 p-2 h-10 overflow-x-hidden">
                    {queue.map((_num: string, index) => (
                        <div
                            key={index}
                            className={`text-center py-2 px-4 min-w-[64px] w-16 text-blue-800 font-semibold flex items-center justify-center ${isPopping && index === 0 ? "popping" : ""}`}
                        >
                            {index}
                        </div>
                    ))}
                </div>

                {/* Queue Controls */}
                <div className="flex gap-2 flex-wrap">
                    <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 p-1 rounded text-sm w-20"
                        placeholder="Value"
                    />
                    <button
                        onClick={() => inputRef.current && enqueue(inputRef.current.value)}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Enqueue()
                    </button>
                    <button
                        onClick={dequeue}
                        className="bg-red-500 text-white font-semibold py-2 px-2 rounded hover:bg-red-600 transition"
                    >
                        Dequeue()
                    </button>
                    <button
                        onClick={peek}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                    >
                        Peek()
                    </button>
                    <button
                        onClick={() => toast(isEmpty ? "Queue is Empty" : "Queue is Not Empty", { duration: toastDuration })}
                        className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition"
                    >
                        IsEmpty()
                    </button>
                </div>
            </div>

            {/* Queue Size Controls */}
            <div className="mt-3 flex items-center space-x-3">
                <label htmlFor="size" className="text-sm font-medium">Enter the Size of Queue</label>
                <button
                    onClick={() => {
                        if (size > 1) setSize(size - 1);
                        setQueue([]); // Reset queue on size change
                    }}
                    type="button"
                    className="bg-blue-400 rounded-full px-2"
                >
                    -
                </button>
                <input
                    className="border border-gray-300 rounded text-center w-11 pl-1 text-sm"
                    type="number"
                    id="size"
                    onChange={(e) => {
                        const newSize = Math.max(1, Math.min(Number(e.target.value), 200));
                        if (newSize !== size) {
                            setSize(newSize);
                            setQueue([]); // Reset queue on size change
                        }
                    }}
                    value={size}
                    placeholder="Size"
                />
                <button
                    onClick={() => {
                        setSize(size + 1);
                        setQueue([]); // Reset queue on size change
                    }}
                    type="button"
                    className="bg-blue-400 rounded-full px-2"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default QueueVisualizer;
