import React, {useState} from 'react'
import {BsArrowLeftCircle, BsArrowRightCircle} from 'react-icons/bs'
import {RxDotFilled} from 'react-icons/rx'

const Sliders = () => {

    const slides = [
        {
            url: "https://www.creatibly.com/cdn/shop/products/Creatibly_Product_BusinessCardDesign_500x500_4b56f105-3a40-4726-9531-ab2d148ce108.png?v=1654953104"
        },
        {
            url: "https://cms.cloudinary.vpsvc.com/images/c_scale,dpr_auto,f_auto,q_auto:best,t_productPageHeroGalleryTransformation_v2,w_auto/legacy_dam/en-us/S001721388/NPIB16564-NA-Standard-BC-Hero001"
        },
        {
            url: "https://bpando.org/wp-content/uploads/02_Fogg_Business_Cards_by_Bunch_on_BPO1.jpg"
        },
        {
            url: "https://i.etsystatic.com/16874044/r/il/0893fa/4052828504/il_fullxfull.4052828504_2f95.jpg"
        },
        {
            url: "https://printmor.com/wp-content/uploads/2016/12/Rush-Card_v3-700x525.png"
        }
    ]

    const [current, setCurrent] = useState(0)

    const prevSlide = () => {
        const lastSlide = current === 0;
        const goBack = lastSlide ? slides.length -1 : current -1;
        setCurrent(goBack)
    }

    const nextSlide = () => {
        const nextSlide = current === slides.length -1;
        const goNext = nextSlide ? 0 : current +1;
        setCurrent(goNext)
    }

    const goToSlide = (indexSlide) => {
        setCurrent(indexSlide)
    }

  return (
    <div className="bg-neutral-400">
        
        <div className="max-w-[700px] h-[500px] w-full m-auto py-16 px-4 relative group">
            <div style={{backgroundImage: `url(${slides[current].url})`}} className="w-full h-full rounded-2xl bg-center bg-cover duration-300 brightness-50"></div>
            
            <div onClick={prevSlide} className="text-white cursor-pointer absolute top-[50%] transition-x-0 transition-y-[50%] left-10">
                <BsArrowLeftCircle size={30} />
            </div>

            <div onClick={nextSlide} className="text-white cursor-pointer absolute top-[50%] transition-x-0 transition-y-[50%] right-10">
                <BsArrowRightCircle size={30} />
            </div>

            <div className="flex top-4 justify-center py-2">
                {slides.map((slide, index) => (
                    <div key={index} onClick={() => goToSlide(index)} className="text-white cursor-pointer text-2xl">
                        <RxDotFilled />
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default Sliders