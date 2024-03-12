import React, { useEffect, useState } from "react";
import './header.scss'
import {
    Badge,
    Col
} from 'antd'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    ShopOutlined
} from '@ant-design/icons';
import {
    WrapperHeader,
    WrapperTextHeader, 
    WrapperHeaderAccount
} from "./style";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Popover } from 'antd';
import * as userServices from '../../services/userServices'
// const { Search } = Input;
// const onSearch = (value, _e, info) => console.log(info?.source, value);
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import { resetSearch, searchProduct } from "../../redux/slices/productSlice";
import { resetCart } from "../../redux/slices/orderSlice";
import {useQuery} from "react-query";
import * as productServices from '../../services/productServices';
import {useDebounce} from "../../hooks/useDebounce";
import { Scrollbars } from 'react-custom-scrollbars';
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const order = useSelector((state) => state.order);
    const location = useLocation();
    const handleNavigationLogin = () => {
        navigate('/sign-in', {state: location.pathname})
    }
    const handleLogout = async () => {
        setLoading(true)
        await userServices.logoutUser();
        dispatch(resetUser());
        dispatch(resetCart());
        navigate('/')
        setLoading(false)
    }
    useEffect(() => {
        setLoading(true);
        setName(user?.name);
        setAvatar(user?.avatar);
        setLoading(false);
    }, [user?.name, user?.avatar])
    const content = (
        <div>
            <p className="content-popup" onClick={() => handleClickNavigate('profile')}>Thông tin tài khoản</p>
            <p className="content-popup" onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</p>
            { user?.isAdmin ?
                <p className="content-popup" onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</p>
                : 
                null
            }
            <p className="content-popup" onClick={() => handleClickNavigate()}>Đăng xuất</p>
        </div>
    );
    
    // SEARCH
    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value))
    }
    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user');
        } else if (type === 'admin') {
            navigate('/system/admin');
        } else if (type === 'my-order') {
            navigate(`/my-order`, {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }
    // POPUP SEARCH
    const [productSearchs, setProductSearchs] = useState([]);
    const fetchProductSearch = async (context) => {
        const limit = context && context.queryKey && context.queryKey[1];
        const search_info = context && context.queryKey && context.queryKey[2];
        if(search_info !== '') {
            const response = await productServices.getAllProduct(search_info, limit);
            return response;
        }
    }
    let product_search = useSelector(state => state.product.search);
    let searchDebounce = useDebounce(product_search, 1000);
    const {data: productSearch} = useQuery({queryKey: ["product_search", 6, searchDebounce], queryFn: fetchProductSearch});
    const handleNavigateDetailProduct = (productId) => {
        dispatch(resetSearch());
        navigate(`/product-details/${productId}`);
    }
    const handleBtnMore = () => {
        navigate(`/product/${productSearchs[0].type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')?.replace(/đ/g, 'd').replace(/Đ/g, 'D')}`, {state: productSearchs[0].type})
        dispatch(resetSearch());
    }
    useEffect(() => {
        if(productSearch && productSearch.data && productSearch.data.length > 0) {
            setProductSearchs(productSearch.data);
        } else {
            setProductSearchs([]);
        }
    }, [productSearch]);
    return (
        <div className="header-container">
            <WrapperHeader className="header-content">
                <Col span={6}>
                    <span
                        className="header-text"
                        onClick={() => navigate('/')
                    }>
                       Cửa hàng di động
                    </span>
                </Col>
                { isHiddenSearch === false ?
                    <Col span={12} className="navigation-search">
                        <ButtonInputSearch
                            size={'large'}
                            placeholder={'Nhập tên sản phẩm'}
                            textbutton={'Tìm kiếm'}
                            onChange={onSearch}
                            value={product_search}
                        />
                        {
                            searchDebounce !== '' &&
                                <div className="popup-search">
                                    <Scrollbars autoHide height={260}>
                                        <div className="search-title">
                                            <ShopOutlined className="icon" />
                                            <span style={{color: 'black'}}>Tìm Shop "{product_search}"</span>
                                        </div>
                                        <div className="search-results">
                                            {
                                                productSearchs && productSearchs.length > 0 ?
                                                    <>
                                                        {   
                                                            productSearchs.map((product) => {
                                                                return (
                                                                    <div className="result-child" key={`result-${product.id}`}
                                                                        onClick={() => handleNavigateDetailProduct(product.id)}
                                                                    >
                                                                        <div className="result-image">
                                                                            <img src={product.image} alt="Hình ảnh sản phẩm"/>
                                                                        </div>
                                                                        <div className="result-detail">
                                                                            <h4 className="name">{product.name}</h4>
                                                                            <span className="price">{product.price}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        
                                                        }
                                                    </>
                                                    :
                                                    <span style={{color: "rgba(0, 0, 0, 0.86)", paddingLeft: '10px', height: '20px'}}>Không tìm thấy kết quả...</span>
                                            }    
                                        </div>
                                        {
                                            productSearchs.length !== 0 &&
                                                <button className="btn-more" onClick={() => handleBtnMore()}>
                                                    Xem thêm
                                                </button>
                                        }
                                    </Scrollbars>   
                                </div>
                        }
                    </Col>
                  :
                    <></>
                }
                <Col span={6} className="header-right">
                    <WrapperHeaderAccount className="header-right-content">
                        <div className="content-left">
                        {
                            avatar ? 
                            <img src={avatar} className="user-avatar"/>
                            : 
                            <UserOutlined className="user-icon"/>
                        }
                        </div>
                        <LoadingComponent isLoading={loading}>
                            <div className="content-middle">
                                {
                                    user?.access_token ?   
                                        <Popover content={content} trigger="click" open={isOpenPopup}>
                                            <div className="user-account" style={{cursor: 'pointer'}} onClick={() => setIsOpenPopup(!isOpenPopup)}>{(user.name.length > 0 && user.name) || 'User'}</div>
                                        </Popover>
                                    :
                                    <>
                                        <span onClick={() => handleNavigationLogin()}>
                                            Đăng nhập/Đăng ký
                                        </span>
                                        <div className="header-account">
                                            <span>Tài khoản</span>
                                            <CaretDownOutlined className="dropdown-icon-header"/>
                                        </div>
                                    </>
                                }
                            </div>
                        </LoadingComponent>
                        { isHiddenCart === false ?
                            <div className="header-cart" onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                                <Badge key={user?.id} data={ user?.id } count={user?.access_token ? order?.orderItems?.length : 0} size={'small'}>
                                    <ShoppingCartOutlined key={user?.id} className="icon-cart"/>
                                </Badge>
                                    <span className="text-cart">Giỏ hàng</span>
                            </div>
                            :
                            <></>
                        }
                    </WrapperHeaderAccount>
                </Col>
            </WrapperHeader>
        </div>
    )
}
export default HeaderComponent