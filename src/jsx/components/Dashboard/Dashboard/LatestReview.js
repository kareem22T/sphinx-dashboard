import {Link} from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import user5 from './../../../../images/users/user5.jpg';
import user6 from './../../../../images/users/user6.jpg';
import user7 from './../../../../images/users/user7.jpg';
import { useEffect, useState } from 'react';
import { Approve, Reject, getRating } from '../../../../handeApisMethods/rate';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from '../../../../handeApisMethods/a-MainVariables';
import { Button } from 'react-bootstrap';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
  	<div className="owl-nav">
		<div className="owl-next fas fa-arrow-right"  onClick={onClick}/>
	</div>	
  );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
		<div className="owl-nav">
			<div className=" owl-prev fas fa-arrow-left" onClick={onClick} style={{zIndex:1}}/>
		</div>
    );
}

const LatestReview = () =>{
	const [ratings, setRatings] = useState([])
	const settings = {
		dots: false,
		infinite: true,
		arrows: true,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		speed: 3000,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1560,
				settings: {
				  slidesToShow: 3,
				  slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1400,
				settings: {
				  slidesToShow: 2,
				  slidesToScroll: 1,
				},
			},	
			{
				breakpoint: 640,
				settings: {
				  slidesToShow: 1,
				  slidesToScroll: 1,
				},
			},
		],
	};

	const notifyError = (err) => {
		toast.error("❌ " + err, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}
	const notifyTopRight = (msg) => {
		toast.success("✔️ " + msg, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: false,
			pauseOnHover: true,
			draggable: true,
		});
	};


	const handleReject = (id) => {
		Reject(id).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getRating().then(res => {
					setRatings(res.data)
				})
			} else {
				notifyError(res.data.errors[0])
			}
		})
	}
	const handleApprove = (id) => {
		Approve(id).then(res => {
			if (res.data.status === true) {
				notifyTopRight(res.data.message)
				getRating().then(res => {
					setRatings(res.data)
				})
			} else {
				notifyError(res.data.errors[0])
			}
		})
	}

	useEffect(() => {
		getRating().then(res => {
			setRatings(res.data)
		})
	}, [])
	return(
		<>
			<ToastContainer>
			</ToastContainer>
			<Slider className="front-view-slider owl-carousel owl-carousel owl-loaded owl-drag owl-dot" {...settings}>				
				{
					ratings.map(rate => (
						<div className="items" key={rate.id}>
							<div className="customers border">
								<p className="fs-16">{rate.describe}</p>
								<div className="d-flex justify-content-between align-items-center mt-4">
									<div className="customer-profile d-flex ">
									<img src={rate.user.join_type == "Google" ? rate.user.picture :( rate.user.picture ? url + rate.user.picture : "../../../images/avatar/default_user.jpg")} alt="" />
									<div className="ms-3">
										<h5 className="mb-0"><Link to={"#"}>{rate.user.name}</Link></h5>
										<span>
											{new Date(rate.created_at) > new Date() - 864e5 ?
											new Date(rate.created_at).toLocaleTimeString("en-US", { hour12: true, hour: 'numeric', minute: '2-digit' }) :
											String(new Date(rate.created_at).getHours()).padStart(2, '0') + ':' + String(new Date(rate.created_at).getMinutes()).padStart(2, '0') + ' ' + (new Date(rate.created_at).getHours() >= 12 ? 'PM' : 'AM')}
										</span>
									</div>
									</div>
									<div className="customer-button text-nowrap">
										<button style={{background: "transparent", border: 'none', fontSize: 22, marginRight: 10}} onClick={() => handleApprove(rate.id)}><i className="far fa-check-circle text-success"></i></button>
										<button style={{background: "transparent", border: 'none', fontSize: 22}} onClick={() => handleReject(rate.id)}><i className="far fa-times-circle text-danger"></i></button>
									</div>
								</div>
							</div>
						</div>
					))
				}
				{
					ratings.length < 3 && (
						<div className="">
						</div>
					)
				}
				{
					ratings.length < 3 && (
						<div className="">
						</div>
					)
				}
			</Slider>
			{
				ratings.length === 0 && (
					<p style={{textAlign: 'center'}}>There is no Reviews yet</p>
				)
			}
		</>
	)
}
export default LatestReview;