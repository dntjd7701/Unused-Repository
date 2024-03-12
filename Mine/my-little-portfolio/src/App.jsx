import Navbar from "./components/Navbar"

function App() {
  return (
    <div className='bg-primary w-full overflow-hidden'>
      {/* 반응형 디자인에 맞게 스크린 사이즈 적용 */}
      <div className="sm:px-16 px-6 flex justify-center items-center">
        {/* 스크린 사이즈가 최대일 경우, max width 사이즈 조정 */}
        <div className="xl:max-w-[1280px] w-full">
          <Navbar />
        </div>
      </div>
    </div>
  )
}

export default App
