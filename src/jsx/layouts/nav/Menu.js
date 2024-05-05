export const MenuList = [
    //Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="fas fa-home"/>,
        to: '',
        content: []
    },
    //Setting
    {
        title: 'Edit Home',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="fas fa-pen"/>,
        to: '/Settings',
        content: []
    },
    // Requests
    {
        title: 'Requests',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-calendar"></i>,
        to: "/Requests"
    },
    // Chat
    {
        title: 'Chats',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-comments"></i>,
        to: "/Chats"
    },
    {
        title: 'Currencies',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="fas fa-money-bill" />,
        to: '/Currencies',
        content: []
    },
    
    
    {
        title: 'Languages',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="fas fa-language" />,
        to: '/Languages',
        content: []
    },
    
    //Hotels
    {
        title: 'Hotels',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-hotel"></i>,
        content: [
            {
                title: 'Preview',
                to: '/Hotels'
            },
            {
                title: 'Add',
                to: '/create-hotel'
            },
            {
                title: 'Features',	
                to: '/Features',
            },
        ],
    },
    
    // Tours
    {
        title: 'Tours',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-suitcase-rolling"></i>,
        content: [
            {
                title: 'Preview',
                to: '/Tours'
            },
            {
                title: 'Add',
                to: '/create-tour'
            },
        ],
    },
    
    // Destinations
    {
        title: 'Destinations',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-map"></i>,
        to: "/Destinations"
    },
    
    // Activities
    {
        title: 'Activities',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-walking"></i>,
        to: "/Activities"
    },
    
    // Cars
    {
        title: 'Cars',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-car"></i>,
        content: [
            {
                title: 'Preview',
                to: '/Cars'
            },
            {
                title: 'Add',
                to: '/create-car'
            },
            {
                title: 'Features',
                to: '/cars-features'
            },
        ],
    },
    
    // Resturants
    {
        title: 'Resturants',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-utensils"></i>,
        content: [
            {
                title: 'Preview',
                to: '/Resturants'
            },
            {
                title: 'Add',
                to: '/create-resturant'
            },
        ],
    },
    
    

    // //Apps
    // {
    //     title: 'Apps',	
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-info-circle"></i>,
    //     content: [
    //         {
    //             title: 'Profile',
    //             to: 'app-profile'
    //         },
    //         // {
    //         //     title: 'Edit Profile',
    //         //     to: 'edit-profile'
    //         // },
    //         {
    //             title: 'Post Details',
    //             to: 'post-details'
    //         },
    //         {
    //             title: 'Email',
    //             //to: './',
    //             hasMenu : true,
    //             content: [
    //                 {
    //                     title: 'Compose',
    //                     to: 'email-compose',
    //                 },
    //                 {
    //                     title: 'Index',
    //                     to: 'email-inbox',
    //                 },
    //                 {
    //                     title: 'Read',
    //                     to: 'email-read',
    //                 }
    //             ],
    //         },
    //         {
    //             title:'Calendar',
    //             to: 'app-calender'
    //         },
    //         {
    //             title: 'Shop',
    //             //to: './',
    //             hasMenu : true,
    //             content: [
    //                 {
    //                     title: 'Product Grid',
    //                     to: 'ecom-product-grid',
    //                 },
    //                 {
    //                     title: 'Product List',
    //                     to: 'ecom-product-list',
    //                 },
    //                 {
    //                     title: 'Product Details',
    //                     to: 'ecom-product-detail',
    //                 },
    //                 {
    //                     title: 'Order',
    //                     to: 'ecom-product-order',
    //                 },
    //                 {
    //                     title: 'Checkout',
    //                     to: 'ecom-checkout',
    //                 },
    //                 {
    //                     title: 'Invoice',
    //                     to: 'ecom-invoice',
    //                 },
    //                 {
    //                     title: 'Customers',
    //                     to: 'ecom-customers',
    //                 },
    //             ],
    //         },
    //     ],
    // },
    // //Charts
    // {
    //     title: 'Charts',	
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-chart-line"></i>,
    //     content: [
            
    //         {
    //             title: 'RechartJs',
    //             to: 'chart-rechart',					
    //         },
    //         {
    //             title: 'Chartjs',
    //             to: 'chart-chartjs',					
    //         },
    //         {
    //             title: 'Sparkline',
    //             to: 'chart-sparkline',					
    //         },
    //         {
    //             title: 'Apexchart',
    //             to: 'chart-apexchart',					
    //         },
    //     ]
    // },
    // //Boosttrap
    // {
    //     title: 'Bootstrap',	
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fab fa-bootstrap"></i>,	
    //     content: [
    //         {
    //             title: 'Accordion',
    //             to: 'ui-accordion',					
    //         },
    //         {
    //             title: 'Alert',
    //             to: 'ui-alert',					
    //         },
    //         {
    //             title: 'Badge',
    //             to: 'ui-badge',					
    //         },
    //         {
    //             title: 'Button',
    //             to: 'ui-button',					
    //         },
    //         {
    //             title: 'Modal',
    //             to: 'ui-modal',					
    //         },
    //         {
    //             title: 'Button Group',
    //             to: 'ui-button-group',					
    //         },
    //         {
    //             title: 'List Group',
    //             to: 'ui-list-group',					
    //         },
    //         {
    //             title: 'Cards',
    //             to: 'ui-card',					
    //         },
    //         {
    //             title: 'Carousel',
    //             to: 'ui-carousel',					
    //         },
    //         {
    //             title: 'Dropdown',
    //             to: 'ui-dropdown',					
    //         },
    //         {
    //             title: 'Popover',
    //             to: 'ui-popover',					
    //         },
    //         {
    //             title: 'Progressbar',
    //             to: 'ui-progressbar',					
    //         },
    //         {
    //             title: 'Tab',
    //             to: 'ui-tab',					
    //         },
    //         {
    //             title: 'Typography',
    //             to: 'ui-typography',					
    //         },
    //         {
    //             title: 'Pagination',
    //             to: 'ui-pagination',					
    //         },
    //         {
    //             title: 'Grid',
    //             to: 'ui-grid',					
    //         },
    //     ]
    // },
    // //plugins
    // {
    //     title:'Plugins',
    //     classsChange: 'mm-collapse',
    //     iconStyle : <i className="fas fa-heart"></i>,
    //     content : [
    //         {
    //             title:'Select 2',
    //             to: 'uc-select2',
    //         },
    //         // {
    //         //     title:'Noui Slider',
    //         //     to: 'uc-noui-slider',
    //         // },
    //         {
    //             title:'Sweet Alert',
    //             to: 'uc-sweetalert',
    //         },
    //         {
    //             title:'Toastr',
    //             to: 'uc-toastr',
    //         },
    //         {
    //             title:'Jqv Map',
    //             to: 'map-jqvmap',
    //         },
    //         {
    //             title:'Light Gallery',
    //             to: 'uc-lightgallery',
    //         },
    //     ]
    // },
    // //Widget
    // {   
    //     title:'Widget',
    //     //classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-user-check"></i>,
    //     to: 'widget-basic',
    // },
    // //Forms
    // {
    //     title:'Forms',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-file-alt"></i>,
    //     content : [
    //         {
    //             title:'Form Elements',
    //             to: 'form-element',
    //         },
    //         {
    //             title:'Wizard',
    //             to: 'form-wizard',
    //         },
    //         {
    //             title:'CkEditor',
    //             to: 'form-ckeditor',
    //         },
    //         {
    //             title:'Pickers',
    //             to: 'form-pickers',
    //         },
    //         {
    //             title:'Form Validate',
    //             to: 'form-validation',
    //         },

    //     ]
    // },
    // //Table
    // {
    //     title:'Table',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-table"></i>,
    //     content : [
    //         {
    //             title:'Table Filtering',
    //             to: 'table-filtering',
    //         },
    //         {
    //             title:'Table Sorting',
    //             to: 'table-sorting',
    //         },
    //         {
    //             title:'Bootstrap',
    //             to: 'table-bootstrap-basic',
    //         },
           

    //     ]
    // },
    // //Pages
    // {
    //     title:'Pages',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <i className="fas fa-clone"></i>,
    //     content : [
    //         {
    //             title:'Error',
    //             hasMenu : true,
    //             content : [
    //                 {
    //                     title: 'Error 400',
    //                     to : 'page-error-400',
    //                 },
    //                 {
    //                     title: 'Error 403',
    //                     to : 'page-error-403',
    //                 },
    //                 {
    //                     title: 'Error 404',
    //                     to : 'page-error-404',
    //                 },
    //                 {
    //                     title: 'Error 500',
    //                     to : 'page-error-500',
    //                 },
    //                 {
    //                     title: 'Error 503',
    //                     to : 'page-error-503',
    //                 },
    //             ],
    //         },
    //         {
    //             title:'Lock Screen',
    //             to: 'page-lock-screen',
    //         },

    //     ]
    // },
    
]