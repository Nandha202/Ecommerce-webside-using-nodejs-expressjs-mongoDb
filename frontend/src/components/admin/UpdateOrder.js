import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOrder, orderDetail as orderDetailAction } from "../../actions/orderActions";
import { clearError, clearOrder, clearOrderUpdated } from "../../slices/orderSlice";
import SideBar from "./Sidebar";


export default function UpdateOrder() {
    const {loading, isOrderUpdated, error, orderDetail={} } = useSelector(state => state.orderState)
    const { shippingInfo={}, user={}, orderItems=[], totalPrice=0, paymentInfo={} } = orderDetail;
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true: false;
    const [orderStatus, setOrderStatus] = useState("Processing");

    const dispatch = useDispatch();
    const {id} = useParams();

    const updateOrderHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder(id, orderData))
    }
       
    useEffect(() => {
        if(orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    },[orderDetail]) 
    

    useEffect(() => {
        if(isOrderUpdated){
            toast('Order Updated Successfully!', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearOrderUpdated()) }
            })
            
            return ;
        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        
        if(!orderDetail._id) {
            dispatch(orderDetailAction(id))
        }
        return () => {
            dispatch(clearOrder())
        }
       
    },[dispatch, error, isOrderUpdated])


    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
          
                {/* Copied from UserOrders and modified to list admin products */}
                <Fragment>
                    
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-7 order-details">

                            <h1 className="my-5">Order # {orderDetail._id}</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                            <p><b>Amount:</b> ${totalPrice}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? 'greenColor' : 'redColor' } ><b>{isPaid ? 'PAID' : 'NOT PAID' }</b></p>
                            
                            <h4 className="my-4">Stripe ID</h4>
                            <p className="greenColor" ><b>{paymentInfo.id}</b></p>


                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus&&orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><b>{orderStatus}</b></p>


                            <h4 className="my-4">Order Items:</h4>

                            <hr />
                            <div className="cart-item my-1">
                            {orderItems && orderItems.map(item => (
                                    <div className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>${item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </div>
                        
                        <div className="col-12 col-lg-3 mt-5">
                                        <h4 className="my-4">Status</h4>

                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name='status'
                                                onChange={e => setOrderStatus(e.target.value)}
                                                value={orderStatus}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </div>

                                        <button disabled={loading} onClick={updateOrderHandler} className="btn btn-primary btn-block">
                                            Update Status
                                        </button>
                                    </div>
                        
                    </div>
        
                </Fragment>
            </div>
        </div>
    )
}