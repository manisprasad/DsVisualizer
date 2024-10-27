import React, { useState } from 'react';
import QueueVisualizer from './component/queue/Queue';
import StackVisualizer from './component/stack/Stack';
import LinkedList from './component/linkedlist/LinkedList';

const App: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    const handleButtonClick = (component: string) => {
        setActiveComponent(component);
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'stack':
                return <StackVisualizer />;
            case 'queue':
                return <QueueVisualizer />;
            case 'linkedlist':
                return <LinkedList />;
            default:
                return null; // Render nothing if no component is active
        }
    };

    return (
        <div className='w-screen'>
            <h1 className='text-center text-2xl'>Data Structure Visualizer</h1>
            <div className='flex items-center justify-center space-x-3'>
                <button 
                    type="button" 
                    className='border-2 p-2 rounded-lg bg-gray-500 text-white hover:bg-slate-900' 
                    onClick={() => handleButtonClick('stack')}
                >
                    Stack
                </button>
                <button 
                    type="button" 
                    className='border-2 p-2 rounded-lg bg-gray-500 text-white hover:bg-slate-900' 
                    onClick={() => handleButtonClick('queue')}
                >
                    Queue
                </button>
                <button 
                    type="button" 
                    className='border-2 p-2 rounded-lg bg-gray-500 text-white hover:bg-slate-900' 
                    onClick={() => handleButtonClick('linkedlist')}
                >
                    Linked List
                </button>
            </div>
            <div className='mt-5'>
                {renderActiveComponent()}
            </div>
        </div>
    );
}

export default App;
