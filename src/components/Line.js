const Line = (props) => {
    return (
        <p className="text-item" id={props.id} ref={ref}>
            <span style={{ fontSize: `${props.currentFontSize}rem`, letterSpacing: `${props.letterSpacing}`}}>{props.text}</span>
        </p>
    )
}

export default React.memo(Line)
