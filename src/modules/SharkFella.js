import React, { useEffect, useState, useCallback } from 'react';
import SharkCard from './SharkCard';
import "../css/sharkFella.css"


function RenderFella({ imageUrl, quote, size, id }) {
    const image_width = 64 * size;
    const image_height = 48 * size;

    const [point, setPoint] = useState({
        left: Math.random() * (window.innerWidth - image_width),
        top: Math.random() * (window.innerHeight - image_height),
    });
    const [showQuote, setShowQuote] = useState(false);
    const [showCard, setShowCard] = useState(false);

    function sayTheLine() {
        if (showQuote) {
            setShowCard(true);
            document.addEventListener('click', handleDocumentClick);
        }
        else setShowQuote(true);
    }

    const handleDocumentClick = () => {
        setShowCard(false);
        document.removeEventListener('click', handleDocumentClick);
    };

    useEffect(() => {
        let timeoutId;
        if (showQuote) {
            timeoutId = setTimeout(() => setShowQuote(false), 5000);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [showQuote]);

    let initialFlip = 1;
    if (Math.round(Math.random()) === 0) initialFlip = -1;
    const [flip, setFlip] = useState(initialFlip);
    const [rotation, setRotation] = useState(0);
    const [time_to_move, setTimeToMove] = useState(0);

    const setNewPoint = useCallback(() => {

        let new_top = 0;
        let new_left = 0;

        if (point.top > window.innerHeight - image_height || point.top < 0 ||
            point.left > window.innerWidth - image_width || point.left < 0) {
            new_top = Math.random() * (window.innerHeight - image_height);
            new_left = Math.random() * (window.innerWidth - image_width);
        } else {
            const q = Math.floor(Math.random() * 4);
            const angle = (Math.random() * 0.2 * Math.PI) - (0.1 * Math.PI);
            const travel = window.innerWidth * 0.2;

            new_top = Math.sin(angle) * travel;
            new_left = Math.cos(angle) * travel;

            if (q === 0) // top_left quadrant
                new_left *= -1;
            else if (q === 2) { // bottom_left quadrant
                new_left *= -1;
                new_top *= -1;
            } else if (q === 3) // bottom_right quadrant
                new_top *= -1;

            new_top += point.top;
            new_left += point.left;

            if (new_top > window.innerHeight - image_height ||
                new_top < 0) new_top = -(new_top - point.top) + point.top;

            if (new_left > window.innerWidth - image_width ||
                new_left < 0) new_left = -(new_left - point.left) + point.left;
        }

        const newPoint = {
            left: new_left,
            top: new_top,
        };

        // could maybe completely remove this part...
        let co = newPoint.top - point.top;
        let ca = newPoint.left - point.left;
        let final_angle = Math.atan(Math.abs(co) / Math.abs(ca));

        if (ca < 0) setFlip(1);
        else setFlip(-1);

        if ((co > 0 && ca < 0) || (co < 0 && ca > 0))
            final_angle = Math.PI * 2 - final_angle;
        setRotation(final_angle);

        setPoint(newPoint);

        setTimeToMove((Math.random() * 2000) + 3000);
    }, [point, image_width, image_height]);

    useEffect(() => {
        const intervalId = setInterval(setNewPoint, time_to_move);
        return () => clearInterval(intervalId);
    }, [setNewPoint, time_to_move]);

    return (
        <>
            <div
                className="sharkFella"
                style={{
                    ...point,
                    transform: `rotate(${rotation}rad)`,
                    transition: `left ${time_to_move}ms linear, top ${time_to_move}ms linear, transform 500ms ease-in-out`,
                }}>
                <div
                    style={{
                        transform: `scaleX(${flip})`,
                        transition: `transform 500ms ease-in-out`,
                    }}
                >
                    <img
                        src={imageUrl}
                        width={image_width}
                        onClick={sayTheLine}
                        alt="Scary shark"
                    />
                </div>
                <p style={{ visibility: showQuote ? 'visible' : 'hidden' }}>{quote}</p>
            </div>
            {showCard && <img src={imageUrl}/>}
        </>
    );
}

export default RenderFella;
