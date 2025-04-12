import { FooterSocials, PaymentIcons } from "@/utils/data/settingsData"
import Image from "next/image"
import Link from "next/link"
import ScrollToTop from "../footerHero/ScrollToTop"

async function Footer() {
  return (
    <div className='footer py-[60px] mobile:text-center bg-[#0C1B20] text-white relative laptopHorizontal:py-[80px] mobile:py-[40px]'>
      <div className='custom_container '>
        <div className='flex footer_menu items-center gap-20 justify-between tablet:grid tablet:grid-cols-2 tablet:gap-40 mobile:grid-cols-1'>
          <div className="menu_block">
            <h2 className="text-xl uppercase text-siteCrem pb-[2px]">Information</h2>
            <Link href="/">Privacy policy</Link>
            <Link href="/">Our terms</Link>
          </div>
          <div className="menu_block">
            <h2 className="text-xl uppercase text-siteCrem text-center pb-[2px]">Social Media</h2>
            <div className='flex items-center gap-[15px] mt-[-10px] mobile:justify-center'>
              {FooterSocials.map((icons, i) => (
                <Link href="/" key={i} className='w-[40px] h-[40px] relative'>
                  <Image
                    src={icons.image}
                    alt="Ricardo portrait"
                    width="auto"
                    height="auto"
                    priority={true}
                    className="h-full w-full"
                    unoptimized
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="menu_block">
            <h2 className="text-xl uppercase text-siteCrem pb-[2px] mobile:text-center">Payment methods</h2>
            <div className='flex items-center gap-[15px] mt-[20px] mobile:justify-center'>
              {PaymentIcons.map((icons, i) => (
                <div key={i} className='w-[40px] h-[25px] relative'>
                  <Image
                    src={icons.image}
                    alt="Ricardo portrait"
                    width="auto"
                    height="auto"
                    quality="100"
                    priority={true}
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='pt-[16px] mt-[60px] relative laptopHorizontal:mt-[30px]'>
          <div className='flex justify-center text-center items-center gap-20 laptopHorizontal:flex-col'>
            {`Copyright ©  ${new Date().getFullYear()}`}
          </div>
        </div>
        <ScrollToTop />
      </div>
    </div>
  )
}

export default Footer