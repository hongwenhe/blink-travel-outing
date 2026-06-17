// 手机外壳 - 桌面端展示用
import type { ReactNode } from 'react'
import gongbilinLogo from '../assets/gongbilin-logo.png'
import StatusBar from './StatusBar'

export default function PhoneFrame({
  children,
  toolbar,
}: {
  children: ReactNode
  toolbar?: ReactNode
}) {
  const phoneScale = 0.8
  const phoneWidth = 390
  const phoneHeight = 844
  const shellPadding = 12
  const outerWidth = phoneWidth + shellPadding * 2
  const outerHeight = phoneHeight + shellPadding * 2

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 overflow-x-hidden">
      <div className="flex flex-col items-center gap-6 max-w-[1100px] w-full">
        {/* 桌面端标题 */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <img className="brand-logo" src={gongbilinLogo} alt="共比邻" />
            <h1 className="font-song text-3xl font-black text-ink tracking-wide">
              共比邻·随行
            </h1>
          </div>
        </div>

        {/* 手机外壳 */}
        {toolbar && <div className="flex justify-center w-full">{toolbar}</div>}
        <div
          className="relative"
          style={{ width: outerWidth * phoneScale, height: outerHeight * phoneScale }}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              width: outerWidth,
              height: outerHeight,
              transform: `scale(${phoneScale})`,
            }}
          >
            <div className="hidden md:block absolute -inset-3 rounded-[58px] bg-gradient-to-br from-ink/20 to-ink/5 blur-xl" />
            <div
              className="relative bg-ink rounded-[48px] p-[12px] shadow-2xl"
              style={{ width: 'fit-content' }}
            >
              <div
                className="relative bg-rice rounded-[40px] overflow-hidden flex flex-col"
                style={{ width: phoneWidth, height: phoneHeight }}
              >
                {/* 听筒 */}
                <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 z-20 items-center gap-3">
                  <div className="w-14 h-1.5 rounded-full bg-ink/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-ink/30" />
                  <div className="w-14 h-1.5 rounded-full bg-ink/30" />
                </div>
                <div className="paper-grain relative z-0 flex-1 min-h-0 flex flex-col">
                  <div className="md:pt-3">
                    <StatusBar />
                  </div>
                  <div className="flex-1 min-h-0 relative overflow-hidden">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
