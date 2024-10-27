import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

const StackVisualizer: React.FC = () => {
    const [size, setSize] = useState<number>(5); // Stack size
    const [stack, setStack] = useState<string[]>([]); // Stack elements
    const [isPopping, setIsPopping] = useState<boolean>(false); // Track pop animation
    const [inputValue, setInputValue] = useState<string>(""); // State for input value
    const lastElementRef = useRef<HTMLDivElement>(null); // Last element reference for scrolling
    const indexRef = useRef<HTMLDivElement>(null); // Reference for the Index section for scrolling
    const stackRef = useRef<HTMLDivElement>(null); // Ref of stack
    const indexStackRef = useRef<HTMLDivElement>(null);

    const top = stack.length - 1;
    const isFull = top === size - 1;
    const isEmpty = top === -1;
    const toastDuration = 700;

    if(stackRef.current && indexStackRef.current){
        stackRef.current.addEventListener('scroll', ()=>{
            if(indexStackRef.current && stackRef.current){
                indexStackRef.current.scrollTop = stackRef.current.scrollTop;
            }
        });
    }

    const push = (item: string): void => {
        if (isFull) {
            toast.error("Stack Overflow", { duration: toastDuration });
            return;
        }
        if (!item) {
            toast.error("Please Enter Value", { duration: toastDuration });
            return;
        }
        setStack((prev) => [...prev, item]);
        setInputValue(""); // Clear input using state
    };

    const pop = (): void => {
        if (isEmpty) {
            toast.error("Stack Underflow Error", { duration: toastDuration });
            return;
        }
        setIsPopping(true);
        setTimeout(() => {
            const poppedElement = stack[top];
            setStack((prev) => prev.slice(0, -1));
            toast.success(`Element popped: ${poppedElement}`, { duration: toastDuration });
            setIsPopping(false);
        }, 500);
    };

    const seek = (): void => {
        if (isEmpty) {
            toast.error("Stack is Empty", { duration: toastDuration });
        } else {
            toast.success(`Top Element: ${stack[top]}`, { duration: toastDuration });
        }
    };

    // Scroll to the last element when the stack updates
    useEffect(() => {
        if (lastElementRef.current) {
            lastElementRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (indexRef.current) {
            indexRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [stack]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-5">
            <h1 className=" font-semibold text-2xl">Stack Visualizer</h1>
            <Toaster/>

            <div className="flex ">
                <h1 className="vertical-writing text-center">Index</h1>

                <div
                    ref={indexStackRef}
                    className="flex flex-col-reverse gap-1 relative w-11 h-64 overflow-hidden ">
                    {stack.map((_num: string, index) => (
                        <div
                            key={index}
                            ref={index === top ? indexRef : null}
                            className={`text-center py-2 ${index == 0 && 'mb-1'} font-semibold flex items-center justify-center ${isPopping && index === top ? "popping" : ""}`}
                        >
                            {isPopping && index === top ? <MdDeleteForever className="text-red-500"/> :
                                <span>{index}</span>}
                        </div>
                    ))}
                </div>

                {/* Stack Display */}
                <div
                    ref={stackRef}
                    className="flex flex-col-reverse gap-1 mr-3 relative border-2 rounded-sm border-black border-t-0 w-32 p-2 h-64 overflow-y-scroll overflow-x-hidden">
                    {stack.map((num: string, index) => (
                        <div
                            key={index}
                            ref={index === top ? lastElementRef : null}
                            className={`bg-blue-200 text-center py-2 px-4 rounded-lg shadow-md text-blue-800 font-semibold flex items-center justify-center ${isPopping && index === top ? "popping" : ""}`}
                        >
                            {isPopping && index === top ? <MdDeleteForever className="text-red-500"/> :
                                <span>{num.length > 8 ? num.slice(0,8) + "..." : num}</span>}
                        </div>
                    ))}
                </div>

                {/* Stack Controls */}
                <div className="flex flex-col space-y-3">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} // Update inputValue on change
                        type="text"
                        className="border border-gray-300 p-1 rounded w-48 text-sm"
                        placeholder="Value"
                    />

                    <button
                        onClick={() => push(inputValue)}
                        className={` text-white font-semibold py-2 px-4 w-48 rounded hover:bg-blue-600 transition 
                            ${inputValue === '' ? 'bg-blue-200 cursor-not-allowed hover:bg-blue-200' : 'bg-blue-500'}`}
                        disabled={inputValue === ''}
                    >
                        Push(<span>{inputValue.length > 12 ? inputValue.slice(0, 10) + '...' : inputValue}</span>)
                    </button>

                    <button
                        onClick={pop}
                        className="bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
                    >
                        Pop()
                    </button>
                    <button
                        onClick={seek}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                    >
                        Seek()
                    </button>
                    <button
                        onClick={() => toast(isEmpty ? "Stack is Empty" : "Stack is Not Empty", {duration: toastDuration})}
                        className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition"
                    >
                        IsEmpty()
                    </button>
                </div>
            </div>

            {/* Stack Size Controls */}
            <div className="mt-3 flex items-center space-x-3">
                <label htmlFor="size" className="text-sm font-medium">Enter the Size of Stack</label>
                <button
                    onClick={() => {
                        if (size > 1) setSize(size - 1);
                        setStack([]); // Reset stack on size change
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
                            setStack([]); // Reset stack on size change
                        }
                    }}
                    value={size}
                    placeholder="Size"
                />
                <button
                    onClick={() => {
                        setSize(size + 1);
                        setStack([]); // Reset stack on size change
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

export default StackVisualizer;
