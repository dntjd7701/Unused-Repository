const Alert = () => {
    return (
    <div className='fixed top-0 left-0 bottom-0 right-0 z-1000'>
        {/* Alert Wrapper */}
        <div className="flex w-full h-full flex-col items-center justify-center">
            {/* BOX */}
            <div className="z-1200 flex bg-white h-[200px] min-w-[300px] relative border-solid border-" onClick={() => {console.log('click')}}>

            </div>
            {/* dim */}
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-dim'/>
        </div>
    </div>
    )
}
export default Alert;