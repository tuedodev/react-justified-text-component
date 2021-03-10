import {useLayoutEffect, useReducer, useRef, useState } from 'react'

const Blocktext = (props) => {

    let textItem = useRef(null);
    const CALCULATION_MAPPING = useRef([
            {divider: 200, multiplier: 1.5},
            {divider: 100, multiplier: 0.8},
            {divider: 50, multiplier: 0.25},
            {divider: 10, multiplier: 0.05},
            {divider: 1, multiplier: 0.03},
            {divider: 0.5, multiplier: 0.01}
        ]);
    const CONFIG = useRef(
        { precisionFrom: 0.98, 
          precisionTo: 1.02,
          maximalCount: 50,
        });

    const [fontsLoaded, setFontsLoaded ] = useState(false);

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
            {text: props.text,
            id: props.id,
            counter: 0,
            currentFontSize: 1,
            uom: 'rem', 
            letterSpacing: 'normal',
            finished: false
            }
        )
    
    const getTextItemDimensions = () => {
        let [childWidth, parentWidth, diff, sign, precisionValue ] = [null];
        if (textItem.current){
            childWidth = textItem.current.querySelector(`span`).getBoundingClientRect().width;
            parentWidth = textItem.current.parentElement.getBoundingClientRect().width
            if (childWidth && parentWidth){
                diff = parentWidth - childWidth;
                sign = diff >= 0 ? 1 : -1;
                precisionValue = childWidth / parentWidth;
            }
        }
        return { diff, sign, precisionValue };
    };
    
    // better use useLayoutEffect instead of useEffect as this hook function is changing and detecting the DOM
    useLayoutEffect(() => {
        const approximateFontSize = ({diff, sign}) => {
            let accumulator = 0;
            let summe = CALCULATION_MAPPING.current.map(step => {
                let subtotal = Math.abs(diff) - accumulator
                let result = Math.floor(subtotal / step.divider);
                accumulator += result * step.divider;
                return result * step.multiplier;
            }).reduce((a,b) => a + b);
            
            return summe * sign;
        }
        
        if (fontsLoaded && !state.finished){
            let {diff, sign, precisionValue} = getTextItemDimensions();
            if (diff){
                if (precisionValue < CONFIG.current.precisionFrom || precisionValue > CONFIG.current.precisionTo ){
                    let adjustFontSize = approximateFontSize({diff, sign});
                    setState({currentFontSize: state.currentFontSize + adjustFontSize});
                    setState({counter: state.counter + 1})
                    if (state.counter > CONFIG.current.maximalCount){
                        setState({finished: true})
                    }
                    
                } else {
                    let letterSpacing = `${diff / state.text.length}px`;
                    setState({finished: true, letterSpacing })
                }
                
            } 
        }         

    }, [state, fontsLoaded])

    useLayoutEffect(() => {
        document.fonts.ready.then(() => {
            setFontsLoaded(true);
        })
    },[])

    return (
        <p className="text-item" style={{ fontSize: state.currentFontSize + state.uom, letterSpacing: state.letterSpacing }} ref={textItem}>
            <span>{ state.text }</span>
        </p>
    )
}

export default Blocktext
