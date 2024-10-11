import React, { forwardRef} from "react";


const CustomTextArea = forwardRef(function CustomTextArea({className = "", value="", minHeight = 32, inlineStyle = {}, disable=false, id="", placeholder="Enter Here",
     onChange,onKeyDown},ref){
//   const textareaRef = useRef(null);
// //   const onChange = (event) => setData(event.target.value);

//   useLayoutEffect(() => {
//     // Reset height - important to shrink on delete
//     textareaRef.current.style.height = "inherit";
//     // Set height
//     textareaRef.current.style.height = `${Math.max(
//       textareaRef.current.scrollHeight,
//       minHeight
//     )}px`;
//   }, [value]);

  return (
    <textarea
      className={className}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={ref}
      placeholder={placeholder}
      style={{
        minHeight: minHeight,
        resize: "none",
        overflow: "hidden",
        ...inlineStyle
      }}
      disabled={disable}
      id={id}
    />
  );
}
)

export default CustomTextArea;