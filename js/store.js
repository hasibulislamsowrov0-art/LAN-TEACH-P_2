/**
 * Smart Land Mapping (স্মার্ট ল্যান্ড ম্যাপিং) - Central Data Store & State Management
 * Bilingual English & Bengali Support, Slides/Carousel Data, Users, Plots & Admin Control
 */

(function (window) {
    'use strict';

    // Admin Credentials defined by user
    const ADMIN_CREDENTIALS = {
        username: 'sowrovshiekjh',
        password: '01742244518',
        role: 'Super System Administrator',
        name: 'Sowrov Sheikh'
    };

    // Default Site Configuration with Bilingual Titles
    const DEFAULT_SITE_CONFIG = {
        siteName: 'Smart Land Mapping',
        siteNameBn: 'স্মার্ট ল্যান্ড ম্যাপিং',
        tagline: 'Next-Gen Digital Cadastral & GIS Land Bureau',
        taglineBn: 'ডিজিটাল ভূমি রেকর্ড, ক্যাডাস্ট্রাল মৌজা জরিপ ও ভেরিফিকেশন পোর্টাল',
        heroTitle: 'Smart Land Mapping & National Verification System',
        heroTitleBn: 'স্মার্ট ল্যান্ড ম্যাপিং ও জাতীয় ভূমি ভেরিফিকেশন সিস্টেম',
        heroDescription: 'Automated geospatial platform for authorized landowners, surveyors, and registry officials. Inspect plots, track crop cultivation, and verify clearances.',
        heroDescriptionBn: 'অনুমোদিত জমির মালিক ও সার্ভেয়ারদের জন্য স্বয়ংক্রিয় জিওস্প্যাশিয়াল প্ল্যাটফর্ম। দাগের সীমানা পরীক্ষা, ফসল ট্র্যাকিং এবং পুলিশ ও আইনি ক্লিয়ারেন্স নিশ্চিত করুন।',
        noticeBanner: '📢 National Cadastral Update: 2026 GIS Satellite Land Mapping is actively synchronized with District Land Revenue Offices. Review clearance updates below.',
        noticeBannerBn: '📢 জাতীয় বিজ্ঞপ্তি: স্মার্ট ক্যাডাস্ট্রাল ২০২৬ জিআইএস স্যাটেলাইট ভূমি ম্যাপিং সকল জেলা রাজস্ব কার্যালয়ে সক্রিয় রয়েছে। নিচে ক্লিয়ারেন্স তথ্য দেখুন।',
        enableNotice: true,
        hotline: '+880 1742-244518',
        supportEmail: 'sowrov@smartlandmapping.gov.bd',
        bureauAddress: 'Survey of Bangladesh GIS Directorate, Agargaon, Dhaka-1207',
        primaryBrandColor: '#16a34a'
    };

    // Slides / Carousel Dataset (English & Bangla)
    const DEFAULT_SLIDES = [
        {
            id: 'slide-1',
            badgeEn: 'GIS SATELLITE 2026',
            badgeBn: 'জিআইএস স্যাটেলাইট ২০২৬',
            titleEn: 'Smart Cadastral Survey & Satellite Mapping',
            titleBn: 'স্মার্ট ডিজিটাল ভূমি জরিপ ও স্যাটেলাইট ম্যাপিং',
            descriptionEn: 'High-precision GPS coordinates, cadastral DAG boundary verification, and real-time RTK positioning across Bangladesh.',
            descriptionBn: 'উচ্চ ক্ষমতাসম্পন্ন জিপিএস স্থানাঙ্ক, ক্যাডাস্ট্রাল দাগের সীমানা যাচাই এবং রিয়েল-টাইম আরটিকে স্যাটেলাইট ম্যাপিং।',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            actionTextEn: 'Explore Live Plots',
            actionTextBn: 'লাইভ প্লট দেখুন',
            actionTab: 'lands'
        },
        {
            id: 'slide-2',
            badgeEn: 'LAND BUREAU VERIFIED',
            badgeBn: 'ভূমি রেকর্ড অধিদপ্তর অনুমোদিত',
            titleEn: 'Instant DAG & Khatian Plot Verification',
            titleBn: 'দাগ ও খতিয়ান নম্বর তাৎক্ষণিক যাচাইকরণ',
            descriptionEn: 'Search, inspect, and confirm land parcels across all Upazilas and Mouzas with official bureau registry verification.',
            descriptionBn: 'সকল উপজেলা ও মৌজার আওতাধীন জমির খতিয়ান এবং দাগের সরকারি রেকর্ড দ্রুত, সহজে ও নির্ভুলভাবে অনুসন্ধান করুন।',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
            actionTextEn: 'Search Cadastre',
            actionTextBn: 'মৌজা অনুসন্ধান',
            actionTab: 'dashboard'
        },
        {
            id: 'slide-3',
            badgeEn: 'SECURE CLEARANCES',
            badgeBn: 'শতভাগ নিরাপদ ও বিরোধমুক্ত',
            titleEn: 'Police Clearance & Seasonal Crop Tracking',
            titleBn: 'থানা পুলিশ ক্লিয়ারেন্স ও মৌসুমী ফসল ট্র্যাকিং',
            descriptionEn: 'Streamlined dispute-free land records with station clearance, photo proof, and agriculture officer inspection logs.',
            descriptionBn: 'থানা পুলিশ স্টেশন ক্লিয়ারেন্স, স্যাটেলাইট ছবি ও কৃষি কর্মকর্তার প্রত্যয়নসহ শতভাগ নিরাপদ ও বিরোধমুক্ত জমির সুরক্ষা।',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
            actionTextEn: 'View Clearances',
            actionTextBn: 'ক্লিয়ারেন্স স্ট্যাটাস',
            actionTab: 'verifications'
        }
    ];

    // 10 Pre-configured Users
    const DEFAULT_USERS = [
        {
            username: 'akmjobayer',
            password: '123',
            fullName: 'AKM Jobayer',
            fullNameBn: 'একেএম জোবায়ের',
            role: 'Lead Surveyor & Landowner',
            roleBn: 'প্রধান সার্ভেয়ার ও ভূমির মালিক',
            district: 'Dhaka Sadar',
            districtBn: 'ঢাকা সদর',
            phone: '+880 1711-223344',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'tanvirh',
            password: '123',
            fullName: 'Tanvir Hossain',
            fullNameBn: 'তানভীর হোসেন',
            role: 'Agricultural Landowner',
            roleBn: 'কৃষি ভূমির মালিক',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            phone: '+880 1812-334455',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'sadia_akter',
            password: '123',
            fullName: 'Sadia Akter',
            fullNameBn: 'সাদিয়া আক্তার',
            role: 'Estate Owner',
            roleBn: 'এস্টেট স্বত্বাধিকারী',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            phone: '+880 1913-445566',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'rahim_mia',
            password: '123',
            fullName: 'Rahim Mia',
            fullNameBn: 'রহিম মিয়া',
            role: 'Farmer & Landholder',
            roleBn: 'কৃষক ও ভূমির জোতদার',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            phone: '+880 1714-556677',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'noshin_tabassum',
            password: '123',
            fullName: 'Noshin Tabassum',
            fullNameBn: 'নশিন তাবাসসুম',
            role: 'Land Administrator',
            roleBn: 'ভূমি প্রশাসনিক কর্মকর্তা',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            phone: '+880 1515-667788',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'arif_chowdhury',
            password: '123',
            fullName: 'Arif Chowdhury',
            fullNameBn: 'আরিফ চৌধুরী',
            role: 'Agri-Business Owner',
            roleBn: 'কৃষি খামারের স্বত্বাধিকারী',
            district: 'Comilla',
            districtBn: 'কুমিল্লা',
            phone: '+880 1816-778899',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'farhana_jahan',
            password: '123',
            fullName: 'Farhana Jahan',
            fullNameBn: 'ফারহানা জাহান',
            role: 'Property Registrar',
            roleBn: 'ভূমি রেজিস্ট্রি তদারককারী',
            district: 'Khulna',
            districtBn: 'খুলনা',
            phone: '+880 1917-889900',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'kamrul_islam',
            password: '123',
            fullName: 'Kamrul Islam',
            fullNameBn: 'কামরুল ইসলাম',
            role: 'Land Supervisor',
            roleBn: 'ল্যান্ড সুপারভাইজার',
            district: 'Bogra',
            districtBn: 'বগুড়া',
            phone: '+880 1618-990011',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'nusrat_jahan',
            password: '123',
            fullName: 'Nusrat Jahan',
            fullNameBn: 'নুসরাত জাহান',
            role: 'Surveyor Assistant',
            roleBn: 'সহকারী সার্ভেয়ার',
            district: 'Barisal',
            districtBn: 'বরিশাল',
            phone: '+880 1719-001122',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        },
        {
            username: 'hasan_ali',
            password: '123',
            fullName: 'Hasan Ali',
            fullNameBn: 'হাসান আলী',
            role: 'Farm Manager',
            roleBn: 'খামার তত্ত্বাবধায়ক',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            phone: '+880 1810-112233',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
            status: 'Active'
        }
    ];

    // Initial Land Plots
    const DEFAULT_PLOTS = [
        {
            id: 'plot-101',
            ownerUsername: 'akmjobayer',
            ownerName: 'AKM Jobayer',
            ownerNameBn: 'একেএম জোবায়ের',
            landNumber: 'DAG-8842',
            khatianNumber: 'KH-402',
            mouza: 'Uttara Model Town, Sector 12',
            mouzaBn: 'উত্তরা মডেল টাউন, সেক্টর ১২',
            district: 'Dhaka Sadar',
            area: '12.5 Decimals',
            areaBn: '১২.৫ শতাংশ',
            coordinates: '23.8759° N, 90.3795° E',
            currentCrop: 'Paddy (Aman Rice)',
            currentCropBn: 'ধান (আমন ধান)',
            pastHistory: 'Wheat (Winter 2024), Jute (Summer 2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            notes: 'High fertility alluvial soil. Fully cadastral surveyed and fenced.',
            createdAt: '2026-01-15T10:30:00Z'
        },
        {
            id: 'plot-102',
            ownerUsername: 'akmjobayer',
            ownerName: 'AKM Jobayer',
            ownerNameBn: 'একেএম জোবায়ের',
            landNumber: 'DAG-9104',
            khatianNumber: 'KH-403',
            mouza: 'Tongi Industrial Zone',
            mouzaBn: 'টঙ্গী শিল্পাঞ্চল',
            district: 'Dhaka Sadar',
            area: '8.2 Decimals',
            areaBn: '৮.২ শতাংশ',
            coordinates: '23.8912° N, 90.4043° E',
            currentCrop: 'Vegetables (Potato & Tomato)',
            currentCropBn: 'সবজি (আলু ও টমেটো)',
            pastHistory: 'Mustard Seeds (2024)',
            imageVerification: 'Pending Review',
            policeVerification: 'Pending Station Clearance',
            cropVerification: 'Pending Inspection',
            landImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
            notes: 'Commercial agricultural plot near Dhaka-Mymensingh highway.',
            createdAt: '2026-02-02T14:15:00Z'
        },
        {
            id: 'plot-201',
            ownerUsername: 'tanvirh',
            ownerName: 'Tanvir Hossain',
            ownerNameBn: 'তানভীর হোসেন',
            landNumber: 'DAG-4521',
            khatianNumber: 'KH-112',
            mouza: 'Joydebpur Rural Area',
            mouzaBn: 'জয়দেবপুর গ্রামীণ এলাকা',
            district: 'Gazipur',
            area: '25.0 Decimals',
            areaBn: '২৫.০ শতাংশ',
            coordinates: '24.0021° N, 90.4211° E',
            currentCrop: 'Sugarcane',
            currentCropBn: 'আখ চাষ',
            pastHistory: 'Corn & Maize (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
            notes: 'Large scale agro plantation tract with drip irrigation facility.',
            createdAt: '2026-01-20T09:00:00Z'
        },
        {
            id: 'plot-301',
            ownerUsername: 'sadia_akter',
            ownerName: 'Sadia Akter',
            ownerNameBn: 'সাদিয়া আক্তার',
            landNumber: 'DAG-3312',
            khatianNumber: 'KH-88',
            mouza: 'Pahartali Hill Tract',
            mouzaBn: 'পাহাড়তলী হিল এলাকা',
            district: 'Chittagong',
            area: '32.4 Decimals',
            areaBn: '৩২.৪ শতাংশ',
            coordinates: '22.3667° N, 91.8000° E',
            currentCrop: 'Tea & Rubber Garden',
            currentCropBn: 'চা ও রাবার বাগান',
            pastHistory: 'Seasonal Spices & Turmeric',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
            notes: 'Hilly slope tea plantation with registered boundary markers.',
            createdAt: '2026-02-10T11:45:00Z'
        },
        {
            id: 'plot-401',
            ownerUsername: 'rahim_mia',
            ownerName: 'Rahim Mia',
            ownerNameBn: 'রহিম মিয়া',
            landNumber: 'DAG-1088',
            khatianNumber: 'KH-55',
            mouza: 'Surma River Basin',
            mouzaBn: 'সুরমা নদী তীরবর্তী এলাকা',
            district: 'Sylhet',
            area: '18.0 Decimals',
            areaBn: '১৮.০ শতাংশ',
            coordinates: '24.8949° N, 91.8687° E',
            currentCrop: 'Boro Rice',
            currentCropBn: 'বোরো ধান',
            pastHistory: 'Winter Mustard & Lentils',
            imageVerification: 'Pending Review',
            policeVerification: 'Pending Station Clearance',
            cropVerification: 'Pending Inspection',
            landImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            notes: 'Fertile river basin farmland subjected to seasonal monsoon irrigation.',
            createdAt: '2026-02-28T16:20:00Z'
        },
        {
            id: 'plot-501',
            ownerUsername: 'arif_chowdhury',
            ownerName: 'Arif Chowdhury',
            ownerNameBn: 'আরিফ চৌধুরী',
            landNumber: 'DAG-7729',
            khatianNumber: 'KH-91',
            mouza: 'Mainamati Heritage Boundary',
            mouzaBn: 'ময়নামতি ঐতিহ্যবাহী সীমানা',
            district: 'Comilla',
            area: '15.8 Decimals',
            areaBn: '১৫.৮ শতাংশ',
            coordinates: '23.4607° N, 91.1809° E',
            currentCrop: 'Mustard & Seasonal Flowers',
            currentCropBn: 'সরিষা ও মৌসুমী ফুল',
            pastHistory: 'Paddy / Boro',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
            notes: 'Agro-tourism farm parcel certified by district agricultural authority.',
            createdAt: '2026-03-05T08:10:00Z'
        },
        {
            id: 'plot-601',
            ownerUsername: 'noshin_tabassum',
            ownerName: 'Noshin Tabassum',
            ownerNameBn: 'নশিন তাবাসসুম',
            landNumber: 'DAG-5510',
            khatianNumber: 'KH-142',
            mouza: 'Paba Agro Orchard Zone',
            mouzaBn: 'পবা ফলজ খামার অঞ্চল',
            district: 'Rajshahi',
            area: '22.0 Decimals',
            areaBn: '২২.০ শতাংশ',
            coordinates: '24.3745° N, 88.6042° E',
            currentCrop: 'Mango Orchard (Fazli & Langra)',
            currentCropBn: 'আম বাগান (ফজলি ও ল্যাংড়া)',
            pastHistory: 'Wheat & Pulses (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
            notes: 'High-yield commercial mango orchard with automated drip pipeline.',
            createdAt: '2026-03-01T10:15:00Z'
        },
        {
            id: 'plot-701',
            ownerUsername: 'farhana_jahan',
            ownerName: 'Farhana Jahan',
            ownerNameBn: 'ফারহানা জাহান',
            landNumber: 'DAG-6234',
            khatianNumber: 'KH-209',
            mouza: 'Dumuria Wetland Basin',
            mouzaBn: 'ডুমুরিয়া জলাশয় এলাকা',
            district: 'Khulna',
            area: '28.5 Decimals',
            areaBn: '২৮.৫ শতাংশ',
            coordinates: '22.8098° N, 89.5644° E',
            currentCrop: 'Shrimp Agro & Organic Grain',
            currentCropBn: 'চিংড়ি খামার ও জৈব ফসল',
            pastHistory: 'Aman Paddy (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
            notes: 'Integrated saline-free agro aquaculture certified by district registrar.',
            createdAt: '2026-03-03T11:00:00Z'
        },
        {
            id: 'plot-801',
            ownerUsername: 'kamrul_islam',
            ownerName: 'Kamrul Islam',
            ownerNameBn: 'কামরুল ইসলাম',
            landNumber: 'DAG-2198',
            khatianNumber: 'KH-318',
            mouza: 'Shibganj Alluvial Valley',
            mouzaBn: 'শিবগঞ্জ পলিমাটি অঞ্চল',
            district: 'Bogra',
            area: '19.4 Decimals',
            areaBn: '১৯.৪ শতাংশ',
            coordinates: '24.8465° N, 89.3777° E',
            currentCrop: 'Potato & Winter Cabbage',
            currentCropBn: 'আলু ও শীতকালীন বাঁধাকপি',
            pastHistory: 'Maize & Jute (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80',
            notes: 'High organic carbon soil with deep tube well irrigation.',
            createdAt: '2026-03-08T09:30:00Z'
        },
        {
            id: 'plot-901',
            ownerUsername: 'nusrat_jahan',
            ownerName: 'Nusrat Jahan',
            ownerNameBn: 'নুসরাত জাহান',
            landNumber: 'DAG-3801',
            khatianNumber: 'KH-74',
            mouza: 'Babuganj River Estuary',
            mouzaBn: 'বাবুগঞ্জ নদী তীরবর্তী এলাকা',
            district: 'Barisal',
            area: '14.0 Decimals',
            areaBn: '১৪.০ শতাংশ',
            coordinates: '22.7010° N, 90.3535° E',
            currentCrop: 'Guava & Coconut Orchard',
            currentCropBn: 'পেয়ারা ও নারিকেল বাগান',
            pastHistory: 'Betel Leaf (2024)',
            imageVerification: 'Pending Review',
            policeVerification: 'Pending Station Clearance',
            cropVerification: 'Pending Inspection',
            landImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
            notes: 'Riverside fertile orchard undergoing satellite boundary inspection.',
            createdAt: '2026-03-10T14:45:00Z'
        },
        {
            id: 'plot-1001',
            ownerUsername: 'hasan_ali',
            ownerName: 'Hasan Ali',
            ownerNameBn: 'হাসান আলী',
            landNumber: 'DAG-9043',
            khatianNumber: 'KH-502',
            mouza: 'Trishal Agro Belt',
            mouzaBn: 'ত্রিশাল কৃষি বলয়',
            district: 'Mymensingh',
            area: '26.8 Decimals',
            areaBn: '২৬.৮ শতাংশ',
            coordinates: '24.7471° N, 90.4203° E',
            currentCrop: 'Fishery & Hybrid Maize',
            currentCropBn: 'মৎস্য খামার ও হাইব্রিড ভুট্টা',
            pastHistory: 'Mustard (2024)',
            imageVerification: 'Verified',
            policeVerification: 'Approved & Cleared',
            cropVerification: 'Verified by Agri Officer',
            landImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
            notes: 'Agro farm parcel with solar pump station and verified demarcation.',
            createdAt: '2026-03-12T07:20:00Z'
        }
    ];

    // Comprehensive All-Districts Police Stations Dataset of Bangladesh
    const DEFAULT_POLICE_STATIONS = [
        // --- Dhaka Division ---
        {
            id: 'pol-dhk-ramna',
            name: 'DMP Ramna Model Police Station',
            nameBn: 'রমনা মডেল থানা, ডিএমপি ঢাকা',
            thana: 'Ramna',
            thanaBn: 'রমনা',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373125',
            dutyOfficer: '01320037800',
            address: 'Ramna, Dhaka-1000',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-dhk-dhanmondi',
            name: 'DMP Dhanmondi Model Police Station',
            nameBn: 'ধানমন্ডি মডেল থানা, ডিএমপি ঢাকা',
            thana: 'Dhanmondi',
            thanaBn: 'ধানমন্ডি',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373126',
            dutyOfficer: '01320037820',
            address: 'Road 8, Dhanmondi, Dhaka',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-dhk-gulshan',
            name: 'DMP Gulshan Model Police Station',
            nameBn: 'গুলশান মডেল থানা, ডিএমপি ঢাকা',
            thana: 'Gulshan',
            thanaBn: 'গুলশান',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373155',
            dutyOfficer: '01320041200',
            address: 'Gulshan-2, Dhaka-1212',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-dhk-uttara-east',
            name: 'DMP Uttara East Police Station',
            nameBn: 'উত্তরা পূর্ব থানা, ডিএমপি ঢাকা',
            thana: 'Uttara East',
            thanaBn: 'উত্তরা পূর্ব',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373157',
            dutyOfficer: '01320041600',
            address: 'Sector 4, Uttara, Dhaka-1230',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-dhk-mirpur',
            name: 'DMP Mirpur Model Police Station',
            nameBn: 'মিরপুর মডেল থানা, ডিএমপি ঢাকা',
            thana: 'Mirpur',
            thanaBn: 'মিরপুর',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373175',
            dutyOfficer: '01320042400',
            address: 'Mirpur-2, Dhaka-1216',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-dhk-tejgaon',
            name: 'DMP Tejgaon Police Station',
            nameBn: 'তেজগাঁও থানা, ডিএমপি ঢাকা',
            thana: 'Tejgaon',
            thanaBn: 'তেজগাঁও',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373177',
            dutyOfficer: '01320042800',
            address: 'Farmgate, Tejgaon, Dhaka',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-dhk-motijheel',
            name: 'DMP Motijheel Police Station',
            nameBn: 'মতিঝিল থানা, ডিএমপি ঢাকা',
            thana: 'Motijheel',
            thanaBn: 'মতিঝিল',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01713373160',
            dutyOfficer: '01320041800',
            address: 'Motijheel C/A, Dhaka-1000',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-dhk-savar',
            name: 'Savar Model Police Station',
            nameBn: 'সাভার মডেল থানা, ঢাকা জেলা',
            thana: 'Savar',
            thanaBn: 'সাভার',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320088500',
            dutyOfficer: '01320088510',
            address: 'Savar Bazar, Dhaka',
            type: 'District Model Thana'
        },
        {
            id: 'pol-dhk-ashulia',
            name: 'Ashulia Police Station',
            nameBn: 'আশুলিয়া থানা, ঢাকা জেলা',
            thana: 'Ashulia',
            thanaBn: 'আশুলিয়া',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320088520',
            dutyOfficer: '01320088530',
            address: 'Baipail, Ashulia, Dhaka',
            type: 'District Thana'
        },
        {
            id: 'pol-dhk-dhamrai',
            name: 'Dhamrai Police Station',
            nameBn: 'ধামরাই থানা, ঢাকা জেলা',
            thana: 'Dhamrai',
            thanaBn: 'ধামরাই',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320088550',
            dutyOfficer: '01320088560',
            address: 'Dhamrai Sadar, Dhaka',
            type: 'District Thana'
        },
        {
            id: 'pol-dhk-keraniganj',
            name: 'Keraniganj Model Police Station',
            nameBn: 'কেরানীগঞ্জ মডেল থানা, ঢাকা জেলা',
            thana: 'Keraniganj',
            thanaBn: 'কেরানীগঞ্জ',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320088600',
            dutyOfficer: '01320088610',
            address: 'Keraniganj, Dhaka',
            type: 'District Model Thana'
        },
        {
            id: 'pol-dhk-sp',
            name: 'Dhaka District Police SP Office',
            nameBn: 'ঢাকা জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Dhaka SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320088000',
            dutyOfficer: '02-223381967',
            address: 'Segunbagicha, Dhaka',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-gaz-joydebpur',
            name: 'Joydebpur Police Station (Gazipur)',
            nameBn: 'জয়দেবপুর থানা, গাজীপুর জেলা',
            thana: 'Joydebpur',
            thanaBn: 'জয়দেবপুর',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320133500',
            dutyOfficer: '01320133510',
            address: 'Joydebpur Sadar, Gazipur',
            type: 'District Model Thana'
        },
        {
            id: 'pol-gaz-tongi-east',
            name: 'GMP Tongi East Police Station',
            nameBn: 'টঙ্গী পূর্ব থানা, জিএমপি গাজীপুর',
            thana: 'Tongi East',
            thanaBn: 'টঙ্গী পূর্ব',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320133550',
            dutyOfficer: '01320133560',
            address: 'Station Road, Tongi, Gazipur',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-gaz-sreepur',
            name: 'Sreepur Police Station (Gazipur)',
            nameBn: 'শ্রীপুর মডেল থানা, গাজীপুর',
            thana: 'Sreepur',
            thanaBn: 'শ্রীপুর',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320133600',
            dutyOfficer: '01320133610',
            address: 'Sreepur Bazar, Gazipur',
            type: 'District Model Thana'
        },
        {
            id: 'pol-gaz-kaliakair',
            name: 'Kaliakair Police Station (Gazipur)',
            nameBn: 'কালিয়াকৈর থানা, গাজীপুর',
            thana: 'Kaliakair',
            thanaBn: 'কালিয়াকৈর',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320133650',
            dutyOfficer: '01320133660',
            address: 'Kaliakair, Gazipur',
            type: 'District Thana'
        },
        {
            id: 'pol-gaz-sp',
            name: 'Gazipur District Police SP Office',
            nameBn: 'গাজীপুর জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Gazipur SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320133000',
            dutyOfficer: '02-9261200',
            address: 'Gazipur Sadar',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-nar-sadar',
            name: 'Narayanganj Sadar Model Police Station',
            nameBn: 'নারায়ণগঞ্জ সদর মডেল থানা',
            thana: 'Narayanganj Sadar',
            thanaBn: 'নারায়ণগঞ্জ সদর',
            district: 'Narayanganj',
            districtBn: 'নারায়ণগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320144500',
            dutyOfficer: '01320144510',
            address: 'Bangabandhu Road, Narayanganj',
            type: 'District Model Thana'
        },
        {
            id: 'pol-nar-fatullah',
            name: 'Fatullah Model Police Station',
            nameBn: 'ফতুল্লা মডেল থানা, নারায়ণগঞ্জ',
            thana: 'Fatullah',
            thanaBn: 'ফতুল্লা',
            district: 'Narayanganj',
            districtBn: 'নারায়ণগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320144550',
            dutyOfficer: '01320144560',
            address: 'Fatullah, Narayanganj',
            type: 'District Model Thana'
        },
        {
            id: 'pol-nar-sonargaon',
            name: 'Sonargaon Police Station',
            nameBn: 'সোনারগাঁও থানা, নারায়ণগঞ্জ',
            thana: 'Sonargaon',
            thanaBn: 'সোনারগাঁও',
            district: 'Narayanganj',
            districtBn: 'নারায়ণগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320144600',
            dutyOfficer: '01320144610',
            address: 'Mograpara, Sonargaon',
            type: 'District Thana'
        },
        {
            id: 'pol-nar-sp',
            name: 'Narayanganj District SP Office',
            nameBn: 'নারায়ণগঞ্জ জেলা পুলিশ সুপার কার্যালয়',
            thana: 'Narayanganj SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Narayanganj',
            districtBn: 'নারায়ণগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320144000',
            dutyOfficer: '02-7647222',
            address: 'Chashara, Narayanganj',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-nar-narsingdi',
            name: 'Narsingdi Model Police Station',
            nameBn: 'নরসিংদী মডেল থানা',
            thana: 'Narsingdi Sadar',
            thanaBn: 'নরসিংদী সদর',
            district: 'Narsingdi',
            districtBn: 'নরসিংদী',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320155500',
            dutyOfficer: '01320155510',
            address: 'Narsingdi Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-tan-sadar',
            name: 'Tangail Sadar Police Station',
            nameBn: 'টাঙ্গাইল সদর থানা',
            thana: 'Tangail Sadar',
            thanaBn: 'টাঙ্গাইল সদর',
            district: 'Tangail',
            districtBn: 'টাঙ্গাইল',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320166500',
            dutyOfficer: '01320166510',
            address: 'Tangail Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-far-kotwali',
            name: 'Kotwali Police Station (Faridpur)',
            nameBn: 'কোতয়ালী থানা, ফরিদপুর',
            thana: 'Kotwali Faridpur',
            thanaBn: 'কোতয়ালী ফরিদপুর',
            district: 'Faridpur',
            districtBn: 'ফরিদপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320177500',
            dutyOfficer: '01320177510',
            address: 'Faridpur Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-man-sadar',
            name: 'Manikganj Sadar Police Station',
            nameBn: 'মানিকগঞ্জ সদর থানা',
            thana: 'Manikganj Sadar',
            thanaBn: 'মানিকগঞ্জ সদর',
            district: 'Manikganj',
            districtBn: 'মানিকগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320188500',
            dutyOfficer: '01320188510',
            address: 'Manikganj Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-mun-sadar',
            name: 'Munshiganj Sadar Police Station',
            nameBn: 'মুন্সীগঞ্জ সদর থানা',
            thana: 'Munshiganj Sadar',
            thanaBn: 'মুন্সীগঞ্জ সদর',
            district: 'Munshiganj',
            districtBn: 'মুন্সীগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320199500',
            dutyOfficer: '01320199510',
            address: 'Munshiganj Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-kis-sadar',
            name: 'Kishoreganj Sadar Model Police Station',
            nameBn: 'কিশোরগঞ্জ সদর মডেল থানা',
            thana: 'Kishoreganj Sadar',
            thanaBn: 'কিশোরগঞ্জ সদর',
            district: 'Kishoreganj',
            districtBn: 'কিশোরগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320200500',
            dutyOfficer: '01320200510',
            address: 'Kishoreganj Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-gop-sadar',
            name: 'Gopalganj Sadar Police Station',
            nameBn: 'গোপালগঞ্জ সদর থানা',
            thana: 'Gopalganj Sadar',
            thanaBn: 'গোপালগঞ্জ সদর',
            district: 'Gopalganj',
            districtBn: 'গোপালগঞ্জ',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320202500',
            dutyOfficer: '01320202510',
            address: 'Gopalganj Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-mad-sadar',
            name: 'Madaripur Sadar Police Station',
            nameBn: 'মাদারীপুর সদর থানা',
            thana: 'Madaripur Sadar',
            thanaBn: 'মাদারীপুর সদর',
            district: 'Madaripur',
            districtBn: 'মাদারীপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320204500',
            dutyOfficer: '01320204510',
            address: 'Madaripur Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-raj-sadar',
            name: 'Rajbari Sadar Police Station',
            nameBn: 'রাজবাড়ী সদর থানা',
            thana: 'Rajbari Sadar',
            thanaBn: 'রাজবাড়ী সদর',
            district: 'Rajbari',
            districtBn: 'রাজবাড়ী',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320206500',
            dutyOfficer: '01320206510',
            address: 'Rajbari Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-sha-sadar',
            name: 'Shariatpur Sadar Police Station',
            nameBn: 'শরীয়তপুর সদর থানা',
            thana: 'Shariatpur Sadar',
            thanaBn: 'শরীয়তপুর সদর',
            district: 'Shariatpur',
            districtBn: 'শরীয়তপুর',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            phone: '01320208500',
            dutyOfficer: '01320208510',
            address: 'Shariatpur Sadar',
            type: 'District Thana'
        },

        // --- Chittagong Division ---
        {
            id: 'pol-ctg-kotwali',
            name: 'CMP Kotwali Police Station (Chittagong)',
            nameBn: 'কোতয়ালী থানা, সিএমপি চট্টগ্রাম',
            thana: 'Kotwali CMP',
            thanaBn: 'কোতয়ালী সিএমপি',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01713373256',
            dutyOfficer: '01320052100',
            address: 'Kotwali, Chittagong',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-ctg-pahartali',
            name: 'CMP Pahartali Police Station',
            nameBn: 'পাহাড়তলী থানা, সিএমপি চট্টগ্রাম',
            thana: 'Pahartali',
            thanaBn: 'পাহাড়তলী',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01713373260',
            dutyOfficer: '01320052500',
            address: 'Pahartali, Chittagong',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-ctg-panchlaish',
            name: 'CMP Panchlaish Police Station',
            nameBn: 'পাঁচলাইশ মডেল থানা, সিএমপি চট্টগ্রাম',
            thana: 'Panchlaish',
            thanaBn: 'পাঁচলাইশ',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01713373262',
            dutyOfficer: '01320052700',
            address: 'Prabartak, Panchlaish, Chittagong',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-ctg-halishahar',
            name: 'CMP Halishahar Police Station',
            nameBn: 'হালিশহর থানা, সিএমপি চট্টগ্রাম',
            thana: 'Halishahar',
            thanaBn: 'হালিশহর',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01713373266',
            dutyOfficer: '01320052900',
            address: 'Halishahar, Chittagong',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-ctg-sitakunda',
            name: 'Sitakunda Model Police Station',
            nameBn: 'সীতাকুণ্ড মডেল থানা, চট্টগ্রাম জেলা',
            thana: 'Sitakunda',
            thanaBn: 'সীতাকুণ্ড',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320108550',
            dutyOfficer: '01320108560',
            address: 'Sitakunda Bazar, Chittagong',
            type: 'District Model Thana'
        },
        {
            id: 'pol-ctg-hathazari',
            name: 'Hathazari Model Police Station',
            nameBn: 'হাটহাজারী মডেল থানা, চট্টগ্রাম জেলা',
            thana: 'Hathazari',
            thanaBn: 'হাটহাজারী',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320108500',
            dutyOfficer: '01320108510',
            address: 'Hathazari, Chittagong',
            type: 'District Model Thana'
        },
        {
            id: 'pol-ctg-sp',
            name: 'Chittagong District Police SP Office',
            nameBn: 'চট্টগ্রাম জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Chittagong SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Chittagong',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320108000',
            dutyOfficer: '031-619988',
            address: 'Chittagong Court Hill',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-cox-sadar',
            name: "Cox's Bazar Sadar Model Police Station",
            nameBn: 'কক্সবাজার সদর মডেল থানা',
            thana: "Cox's Bazar Sadar",
            thanaBn: 'কক্সবাজার সদর',
            district: "Cox's Bazar",
            districtBn: 'কক্সবাজার',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320112500',
            dutyOfficer: '01320112510',
            address: "Kolatoli Road, Cox's Bazar",
            type: 'District Model Thana'
        },
        {
            id: 'pol-cox-teknaf',
            name: 'Teknaf Model Police Station',
            nameBn: 'টেকনাফ মডেল থানা, কক্সবাজার',
            thana: 'Teknaf',
            thanaBn: 'টেকনাফ',
            district: "Cox's Bazar",
            districtBn: 'কক্সবাজার',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320112600',
            dutyOfficer: '01320112610',
            address: 'Teknaf, Cox Bazar',
            type: 'Border Model Thana'
        },
        {
            id: 'pol-com-kotwali',
            name: 'Kotwali Model Police Station (Comilla)',
            nameBn: 'কোতয়ালী মডেল থানা, কুমিল্লা',
            thana: 'Kotwali Comilla',
            thanaBn: 'কোতয়ালী কুমিল্লা',
            district: 'Comilla',
            districtBn: 'কুমিল্লা',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320114500',
            dutyOfficer: '01320114510',
            address: 'Kandirpar, Comilla Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-com-daudkandi',
            name: 'Daudkandi Model Police Station',
            nameBn: 'দাউদকান্দি মডেল থানা, কুমিল্লা',
            thana: 'Daudkandi',
            thanaBn: 'দাউদকান্দি',
            district: 'Comilla',
            districtBn: 'কুমিল্লা',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320114550',
            dutyOfficer: '01320114560',
            address: 'Daudkandi Toll Plaza, Comilla',
            type: 'Highway Model Thana'
        },
        {
            id: 'pol-com-burichang',
            name: 'Burichang Police Station (Comilla)',
            nameBn: 'বুড়িচং থানা, কুমিল্লা',
            thana: 'Burichang',
            thanaBn: 'বুড়িচং',
            district: 'Comilla',
            districtBn: 'কুমিল্লা',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320114600',
            dutyOfficer: '01320114610',
            address: 'Burichang Sadar, Comilla',
            type: 'District Thana'
        },
        {
            id: 'pol-com-sp',
            name: 'Comilla District Police SP Office',
            nameBn: 'কুমিল্লা জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Comilla SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Comilla',
            districtBn: 'কুমিল্লা',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320114000',
            dutyOfficer: '081-65432',
            address: 'Comilla Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-bra-sadar',
            name: 'Brahmanbaria Sadar Model Police Station',
            nameBn: 'ব্রাহ্মণবাড়িয়া সদর মডেল থানা',
            thana: 'Brahmanbaria Sadar',
            thanaBn: 'ব্রাহ্মণবাড়িয়া সদর',
            district: 'Brahmanbaria',
            districtBn: 'ব্রাহ্মণবাড়িয়া',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320116500',
            dutyOfficer: '01320116510',
            address: 'Brahmanbaria Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-noa-sudharam',
            name: 'Sudharam Model Police Station (Noakhali)',
            nameBn: 'সুধারাম মডেল থানা, নোয়াখালী',
            thana: 'Sudharam Noakhali',
            thanaBn: 'সুধারাম নোয়াখালী',
            district: 'Noakhali',
            districtBn: 'নোয়াখালী',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320118500',
            dutyOfficer: '01320118510',
            address: 'Maijdee Court, Noakhali',
            type: 'District Model Thana'
        },
        {
            id: 'pol-fen-sadar',
            name: 'Feni Model Police Station',
            nameBn: 'ফেনী মডেল থানা',
            thana: 'Feni Sadar',
            thanaBn: 'ফেনী সদর',
            district: 'Feni',
            districtBn: 'ফেনী',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320120500',
            dutyOfficer: '01320120510',
            address: 'Feni Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-cha-sadar',
            name: 'Chandpur Sadar Model Police Station',
            nameBn: 'চাঁদপুর সদর মডেল থানা',
            thana: 'Chandpur Sadar',
            thanaBn: 'চাঁদপুর সদর',
            district: 'Chandpur',
            districtBn: 'চাঁদপুর',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320122500',
            dutyOfficer: '01320122510',
            address: 'Chandpur Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-lak-sadar',
            name: 'Lakshmipur Sadar Police Station',
            nameBn: 'লক্ষ্মীপুর সদর থানা',
            thana: 'Lakshmipur Sadar',
            thanaBn: 'লক্ষ্মীপুর সদর',
            district: 'Lakshmipur',
            districtBn: 'লক্ষ্মীপুর',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320123500',
            dutyOfficer: '01320123510',
            address: 'Lakshmipur Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-ran-sadar',
            name: 'Rangamati Kotwali Police Station',
            nameBn: 'রাঙ্গামাটি কোতয়ালী থানা',
            thana: 'Rangamati Sadar',
            thanaBn: 'রাঙ্গামাটি সদর',
            district: 'Rangamati',
            districtBn: 'রাঙ্গামাটি',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320125500',
            dutyOfficer: '01320125510',
            address: 'Rangamati Sadar',
            type: 'Hill Tract Thana'
        },
        {
            id: 'pol-ban-sadar',
            name: 'Bandarban Sadar Police Station',
            nameBn: 'বান্দরবান সদর থানা',
            thana: 'Bandarban Sadar',
            thanaBn: 'বান্দরবান সদর',
            district: 'Bandarban',
            districtBn: 'বান্দরবান',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320127500',
            dutyOfficer: '01320127510',
            address: 'Bandarban Sadar',
            type: 'Hill Tract Thana'
        },
        {
            id: 'pol-kha-sadar',
            name: 'Khagrachhari Sadar Police Station',
            nameBn: 'খাগড়াছড়ি সদর থানা',
            thana: 'Khagrachhari Sadar',
            thanaBn: 'খাগড়াছড়ি সদর',
            district: 'Khagrachhari',
            districtBn: 'খাগড়াছড়ি',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            phone: '01320129500',
            dutyOfficer: '01320129510',
            address: 'Khagrachhari Sadar',
            type: 'Hill Tract Thana'
        },

        // --- Rajshahi Division ---
        {
            id: 'pol-raj-boalia',
            name: 'RMP Boalia Model Police Station (Rajshahi)',
            nameBn: 'বোয়ালিয়া মডেল থানা, আরএমপি রাজশাহী',
            thana: 'Boalia',
            thanaBn: 'বোয়ালিয়া',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01713373300',
            dutyOfficer: '01320061200',
            address: 'Shaheb Bazar, Rajshahi',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-raj-motihar',
            name: 'RMP Motihar Police Station',
            nameBn: 'মতিহার থানা, আরএমপি রাজশাহী',
            thana: 'Motihar',
            thanaBn: 'মতিহার',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01713373305',
            dutyOfficer: '01320061400',
            address: 'Rajshahi University Gate, Motihar',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-raj-godagari',
            name: 'Godagari Model Police Station (Rajshahi)',
            nameBn: 'গোদাগাড়ী মডেল থানা, রাজশাহী জেলা',
            thana: 'Godagari',
            thanaBn: 'গোদাগাড়ী',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320124500',
            dutyOfficer: '01320124510',
            address: 'Godagari, Rajshahi',
            type: 'District Model Thana'
        },
        {
            id: 'pol-raj-sp',
            name: 'Rajshahi District Police SP Office',
            nameBn: 'রাজশাহী জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Rajshahi SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320124000',
            dutyOfficer: '0721-772233',
            address: 'Rajshahi Court',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-bog-sadar',
            name: 'Bogra Sadar Model Police Station',
            nameBn: 'বগুড়া সদর মডেল থানা',
            thana: 'Bogra Sadar',
            thanaBn: 'বগুড়া সদর',
            district: 'Bogra',
            districtBn: 'বগুড়া',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320126500',
            dutyOfficer: '01320126510',
            address: 'Satmatha, Bogra',
            type: 'District Model Thana'
        },
        {
            id: 'pol-bog-shibganj',
            name: 'Shibganj Police Station (Bogra)',
            nameBn: 'শিবগঞ্জ থানা, বগুড়া জেলা',
            thana: 'Shibganj',
            thanaBn: 'শিবগঞ্জ',
            district: 'Bogra',
            districtBn: 'বগুড়া',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320126550',
            dutyOfficer: '01320126560',
            address: 'Shibganj, Bogra',
            type: 'District Thana'
        },
        {
            id: 'pol-bog-sp',
            name: 'Bogra District Police SP Office',
            nameBn: 'বগুড়া জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Bogra SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Bogra',
            districtBn: 'বগুড়া',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320126000',
            dutyOfficer: '051-65488',
            address: 'Bogra Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-pab-sadar',
            name: 'Pabna Sadar Police Station',
            nameBn: 'পাবনা সদর থানা',
            thana: 'Pabna Sadar',
            thanaBn: 'পাবনা সদর',
            district: 'Pabna',
            districtBn: 'পাবনা',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320128500',
            dutyOfficer: '01320128510',
            address: 'Pabna Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-pab-ishwardi',
            name: 'Ishwardi Police Station (Pabna)',
            nameBn: 'ঈশ্বরদী থানা, পাবনা',
            thana: 'Ishwardi',
            thanaBn: 'ঈশ্বরদী',
            district: 'Pabna',
            districtBn: 'পাবনা',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320128550',
            dutyOfficer: '01320128560',
            address: 'Ishwardi, Pabna',
            type: 'Railway Junction Thana'
        },
        {
            id: 'pol-nao-sadar',
            name: 'Naogaon Sadar Model Police Station',
            nameBn: 'নওগাঁ সদর মডেল থানা',
            thana: 'Naogaon Sadar',
            thanaBn: 'নওগাঁ সদর',
            district: 'Naogaon',
            districtBn: 'নওগাঁ',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320130500',
            dutyOfficer: '01320130510',
            address: 'Naogaon Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-nat-sadar',
            name: 'Natore Sadar Police Station',
            nameBn: 'নাটোর সদর থানা',
            thana: 'Natore Sadar',
            thanaBn: 'নাটোর সদর',
            district: 'Natore',
            districtBn: 'নাটোর',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320132500',
            dutyOfficer: '01320132510',
            address: 'Natore Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-sir-sadar',
            name: 'Sirajganj Sadar Police Station',
            nameBn: 'সিরাজগঞ্জ সদর থানা',
            thana: 'Sirajganj Sadar',
            thanaBn: 'সিরাজগঞ্জ সদর',
            district: 'Sirajganj',
            districtBn: 'সিরাজগঞ্জ',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320134500',
            dutyOfficer: '01320134510',
            address: 'Sirajganj Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-cha-sadar2',
            name: 'Chapainawabganj Sadar Model Police Station',
            nameBn: 'চাঁপাইনবাবগঞ্জ সদর মডেল থানা',
            thana: 'Chapainawabganj Sadar',
            thanaBn: 'চাঁপাইনবাবগঞ্জ সদর',
            district: 'Chapainawabganj',
            districtBn: 'চাঁপাইনবাবগঞ্জ',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320136500',
            dutyOfficer: '01320136510',
            address: 'Chapainawabganj Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-joy-sadar',
            name: 'Joypurhat Sadar Police Station',
            nameBn: 'জয়পুরহাট সদর থানা',
            thana: 'Joypurhat Sadar',
            thanaBn: 'জয়পুরহাট সদর',
            district: 'Joypurhat',
            districtBn: 'জয়পুরহাট',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            phone: '01320138500',
            dutyOfficer: '01320138510',
            address: 'Joypurhat Sadar',
            type: 'District Thana'
        },

        // --- Khulna Division ---
        {
            id: 'pol-khu-sadar',
            name: 'KMP Khulna Sadar Police Station',
            nameBn: 'খুলনা সদর থানা, কেএমপি খুলনা',
            thana: 'Khulna Sadar',
            thanaBn: 'খুলনা সদর',
            district: 'Khulna',
            districtBn: 'খুলনা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01713373280',
            dutyOfficer: '01320071200',
            address: 'Dakbangla More, Khulna',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-khu-sonadanga',
            name: 'KMP Sonadanga Model Police Station',
            nameBn: 'সোনাডাঙ্গা মডেল থানা, কেএমপি খুলনা',
            thana: 'Sonadanga',
            thanaBn: 'সোনাডাঙ্গা',
            district: 'Khulna',
            districtBn: 'খুলনা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01713373285',
            dutyOfficer: '01320071400',
            address: 'Sonadanga Bus Stand, Khulna',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-khu-dumuria',
            name: 'Dumuria Police Station (Khulna)',
            nameBn: 'ডুমুরিয়া থানা, খুলনা জেলা',
            thana: 'Dumuria',
            thanaBn: 'ডুমুরিয়া',
            district: 'Khulna',
            districtBn: 'খুলনা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320140500',
            dutyOfficer: '01320140510',
            address: 'Dumuria Sadar, Khulna',
            type: 'District Thana'
        },
        {
            id: 'pol-khu-sp',
            name: 'Khulna District Police SP Office',
            nameBn: 'খুলনা জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Khulna SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Khulna',
            districtBn: 'খুলনা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320140000',
            dutyOfficer: '041-760333',
            address: 'Boyra, Khulna',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-jes-kotwali',
            name: 'Kotwali Model Police Station (Jessore)',
            nameBn: 'কোতয়ালী মডেল থানা, যশোর',
            thana: 'Kotwali Jessore',
            thanaBn: 'কোতয়ালী যশোর',
            district: 'Jessore',
            districtBn: 'যশোর',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320142500',
            dutyOfficer: '01320142510',
            address: 'Jessore Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-jes-sharsha',
            name: 'Sharsha Police Station (Benapole Port)',
            nameBn: 'শার্শা থানা (বেনাপোল বন্দর), যশোর',
            thana: 'Sharsha Benapole',
            thanaBn: 'শার্শা বেনাপোল',
            district: 'Jessore',
            districtBn: 'যশোর',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320142550',
            dutyOfficer: '01320142560',
            address: 'Sharsha, Jessore',
            type: 'Port Border Thana'
        },
        {
            id: 'pol-kus-model',
            name: 'Kushtia Model Police Station',
            nameBn: 'কুষ্টিয়া মডেল থানা',
            thana: 'Kushtia Sadar',
            thanaBn: 'কুষ্টিয়া সদর',
            district: 'Kushtia',
            districtBn: 'কুষ্টিয়া',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320144500',
            dutyOfficer: '01320144510',
            address: 'Kushtia Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-sat-sadar',
            name: 'Satkhira Sadar Police Station',
            nameBn: 'সাতক্ষীরা সদর থানা',
            thana: 'Satkhira Sadar',
            thanaBn: 'সাতক্ষীরা সদর',
            district: 'Satkhira',
            districtBn: 'সাতক্ষীরা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320146500',
            dutyOfficer: '01320146510',
            address: 'Satkhira Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-bag-sadar',
            name: 'Bagerhat Sadar Model Police Station',
            nameBn: 'বাগেরহাট সদর মডেল থানা',
            thana: 'Bagerhat Sadar',
            thanaBn: 'বাগেরহাট সদর',
            district: 'Bagerhat',
            districtBn: 'বাগেরহাট',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320148500',
            dutyOfficer: '01320148510',
            address: 'Bagerhat Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-jhe-sadar',
            name: 'Jhenaidah Sadar Police Station',
            nameBn: 'ঝিনাইদহ সদর থানা',
            thana: 'Jhenaidah Sadar',
            thanaBn: 'ঝিনাইদহ সদর',
            district: 'Jhenaidah',
            districtBn: 'ঝিনাইদহ',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320150500',
            dutyOfficer: '01320150510',
            address: 'Jhenaidah Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-mag-sadar',
            name: 'Magura Sadar Police Station',
            nameBn: 'মাগুরা সদর থানা',
            thana: 'Magura Sadar',
            thanaBn: 'মাগুরা সদর',
            district: 'Magura',
            districtBn: 'মাগুরা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320152500',
            dutyOfficer: '01320152510',
            address: 'Magura Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-chu-sadar',
            name: 'Chuadanga Sadar Police Station',
            nameBn: 'চুয়াডাঙ্গা সদর থানা',
            thana: 'Chuadanga Sadar',
            thanaBn: 'চুয়াডাঙ্গা সদর',
            district: 'Chuadanga',
            districtBn: 'চুয়াডাঙ্গা',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320154500',
            dutyOfficer: '01320154510',
            address: 'Chuadanga Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-meh-sadar',
            name: 'Meherpur Sadar Police Station',
            nameBn: 'মেহেরপুর সদর থানা',
            thana: 'Meherpur Sadar',
            thanaBn: 'মেহেরপুর সদর',
            district: 'Meherpur',
            districtBn: 'মেহেরপুর',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320156500',
            dutyOfficer: '01320156510',
            address: 'Meherpur Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-nar-narail',
            name: 'Narail Sadar Police Station',
            nameBn: 'নড়াইল সদর থানা',
            thana: 'Narail Sadar',
            thanaBn: 'নড়াইল সদর',
            district: 'Narail',
            districtBn: 'নড়াইল',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            phone: '01320158500',
            dutyOfficer: '01320158510',
            address: 'Narail Sadar',
            type: 'District Thana'
        },

        // --- Barisal Division ---
        {
            id: 'pol-bar-kotwali',
            name: 'BMP Kotwali Model Police Station (Barisal)',
            nameBn: 'কোতয়ালী মডেল থানা, বিএমপি বরিশাল',
            thana: 'Kotwali Barisal',
            thanaBn: 'কোতয়ালী বরিশাল',
            district: 'Barisal',
            districtBn: 'বরিশাল',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01713373320',
            dutyOfficer: '01320081200',
            address: 'Band Road, Barisal',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-bar-airport',
            name: 'BMP Airport Police Station (Barisal)',
            nameBn: 'এয়ারপোর্ট থানা, বিএমপি বরিশাল',
            thana: 'Airport Barisal',
            thanaBn: 'এয়ারপোর্ট বরিশাল',
            district: 'Barisal',
            districtBn: 'বরিশাল',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01713373325',
            dutyOfficer: '01320081400',
            address: 'Airport Road, Barisal',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-bar-babuganj',
            name: 'Babuganj Police Station (Barisal)',
            nameBn: 'বাবুগঞ্জ থানা, বরিশাল জেলা',
            thana: 'Babuganj',
            thanaBn: 'বাবুগঞ্জ',
            district: 'Barisal',
            districtBn: 'বরিশাল',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320160500',
            dutyOfficer: '01320160510',
            address: 'Babuganj Sadar, Barisal',
            type: 'District Thana'
        },
        {
            id: 'pol-bar-sp',
            name: 'Barisal District Police SP Office',
            nameBn: 'বরিশাল জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Barisal SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Barisal',
            districtBn: 'বরিশাল',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320160000',
            dutyOfficer: '0431-2173333',
            address: 'Barisal Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-pat-sadar',
            name: 'Patuakhali Sadar Police Station',
            nameBn: 'পটুয়াখালী সদর থানা',
            thana: 'Patuakhali Sadar',
            thanaBn: 'পটুয়াখালী সদর',
            district: 'Patuakhali',
            districtBn: 'পটুয়াখালী',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320162500',
            dutyOfficer: '01320162510',
            address: 'Patuakhali Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-pat-kuakata',
            name: 'Kuakata Tourist Police & Fari',
            nameBn: 'কুয়াকাটা পুলিশ ফাঁড়ি ও ট্যুরিস্ট পুলিশ',
            thana: 'Kuakata',
            thanaBn: 'কুয়াকাটা',
            district: 'Patuakhali',
            districtBn: 'পটুয়াখালী',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320162550',
            dutyOfficer: '01320162560',
            address: 'Kuakata Beach, Patuakhali',
            type: 'Coastal Tourist Police'
        },
        {
            id: 'pol-bho-sadar',
            name: 'Bhola Sadar Model Police Station',
            nameBn: 'ভোলা সদর মডেল থানা',
            thana: 'Bhola Sadar',
            thanaBn: 'ভোলা সদর',
            district: 'Bhola',
            districtBn: 'ভোলা',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320164500',
            dutyOfficer: '01320164510',
            address: 'Bhola Sadar',
            type: 'Island Model Thana'
        },
        {
            id: 'pol-pir-sadar',
            name: 'Pirojpur Sadar Police Station',
            nameBn: 'পিরোজপুর সদর থানা',
            thana: 'Pirojpur Sadar',
            thanaBn: 'পিরোজপুর সদর',
            district: 'Pirojpur',
            districtBn: 'পিরোজপুর',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320166500',
            dutyOfficer: '01320166510',
            address: 'Pirojpur Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-bar-barguna',
            name: 'Barguna Sadar Police Station',
            nameBn: 'বরগুনা সদর থানা',
            thana: 'Barguna Sadar',
            thanaBn: 'বরগুনা সদর',
            district: 'Barguna',
            districtBn: 'বরগুনা',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320168500',
            dutyOfficer: '01320168510',
            address: 'Barguna Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-jha-sadar',
            name: 'Jhalokati Sadar Police Station',
            nameBn: 'ঝালকাঠি সদর থানা',
            thana: 'Jhalokati Sadar',
            thanaBn: 'ঝালকাঠি সদর',
            district: 'Jhalokati',
            districtBn: 'ঝালকাঠি',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            phone: '01320170500',
            dutyOfficer: '01320170510',
            address: 'Jhalokati Sadar',
            type: 'District Thana'
        },

        // --- Sylhet Division ---
        {
            id: 'pol-syl-kotwali',
            name: 'SMP Kotwali Model Police Station (Sylhet)',
            nameBn: 'কোতয়ালী মডেল থানা, এসএমপি সিলেট',
            thana: 'Kotwali Sylhet',
            thanaBn: 'কোতয়ালী সিলেট',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01713373240',
            dutyOfficer: '01320091200',
            address: 'Bandar Bazar, Sylhet',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-syl-shahparan',
            name: 'SMP Shahparan Police Station',
            nameBn: 'শাহপরাণ থানা, এসএমপি সিলেট',
            thana: 'Shahparan',
            thanaBn: 'শাহপরাণ',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01713373245',
            dutyOfficer: '01320091400',
            address: 'Shahparan Gate, Sylhet',
            type: 'Metropolitan Thana'
        },
        {
            id: 'pol-syl-osmani',
            name: 'Osmani Nagar Police Station (Sylhet)',
            nameBn: 'ওসমানী নগর থানা, সিলেট জেলা',
            thana: 'Osmani Nagar',
            thanaBn: 'ওসমানী নগর',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320172500',
            dutyOfficer: '01320172510',
            address: 'Tajpur, Osmani Nagar, Sylhet',
            type: 'District Thana'
        },
        {
            id: 'pol-syl-beanibazar',
            name: 'Beanibazar Police Station (Sylhet)',
            nameBn: 'বিয়ানীবাজার থানা, সিলেট জেলা',
            thana: 'Beanibazar',
            thanaBn: 'বিয়ানীবাজার',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320172550',
            dutyOfficer: '01320172560',
            address: 'Beanibazar Sadar, Sylhet',
            type: 'District Model Thana'
        },
        {
            id: 'pol-syl-sp',
            name: 'Sylhet District Police SP Office',
            nameBn: 'সিলেট জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Sylhet SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320172000',
            dutyOfficer: '0821-713333',
            address: 'Sylhet Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-mou-sadar',
            name: 'Moulvibazar Sadar Model Police Station',
            nameBn: 'মৌলভীবাজার সদর মডেল থানা',
            thana: 'Moulvibazar Sadar',
            thanaBn: 'মৌলভীবাজার সদর',
            district: 'Moulvibazar',
            districtBn: 'মৌলভীবাজার',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320174500',
            dutyOfficer: '01320174510',
            address: 'Moulvibazar Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-mou-sreemangal',
            name: 'Sreemangal Police Station (Tea Capital)',
            nameBn: 'শ্রীমঙ্গল থানা (চা বাগান অঞ্চল), মৌলভীবাজার',
            thana: 'Sreemangal',
            thanaBn: 'শ্রীমঙ্গল',
            district: 'Moulvibazar',
            districtBn: 'মৌলভীবাজার',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320174550',
            dutyOfficer: '01320174560',
            address: 'Sreemangal Town, Moulvibazar',
            type: 'Tea Capital Thana'
        },
        {
            id: 'pol-sun-sadar',
            name: 'Sunamganj Sadar Model Police Station',
            nameBn: 'সুনামগঞ্জ সদর মডেল থানা',
            thana: 'Sunamganj Sadar',
            thanaBn: 'সুনামগঞ্জ সদর',
            district: 'Sunamganj',
            districtBn: 'সুনামগঞ্জ',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320176500',
            dutyOfficer: '01320176510',
            address: 'Sunamganj Sadar',
            type: 'Haor Region Model Thana'
        },
        {
            id: 'pol-hab-sadar',
            name: 'Habiganj Sadar Model Police Station',
            nameBn: 'হবিগঞ্জ সদর মডেল থানা',
            thana: 'Habiganj Sadar',
            thanaBn: 'হবিগঞ্জ সদর',
            district: 'Habiganj',
            districtBn: 'হবিগঞ্জ',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            phone: '01320178500',
            dutyOfficer: '01320178510',
            address: 'Habiganj Sadar',
            type: 'District Model Thana'
        },

        // --- Rangpur Division ---
        {
            id: 'pol-ran-kotwali',
            name: 'RPMP Kotwali Police Station (Rangpur)',
            nameBn: 'কোতয়ালী থানা, আরপিএমপি রংপুর',
            thana: 'Kotwali Rangpur',
            thanaBn: 'কোতয়ালী রংপুর',
            district: 'Rangpur',
            districtBn: 'রংপুর',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01713373340',
            dutyOfficer: '01320101200',
            address: 'Jahaj Company More, Rangpur',
            type: 'Metropolitan Model Thana'
        },
        {
            id: 'pol-ran-mithapukur',
            name: 'Mithapukur Police Station (Rangpur)',
            nameBn: 'মিঠাপুকুর থানা, রংপুর জেলা',
            thana: 'Mithapukur',
            thanaBn: 'মিঠাপুকুর',
            district: 'Rangpur',
            districtBn: 'রংপুর',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320180500',
            dutyOfficer: '01320180510',
            address: 'Mithapukur, Rangpur',
            type: 'District Thana'
        },
        {
            id: 'pol-ran-sp',
            name: 'Rangpur District Police SP Office',
            nameBn: 'রংপুর জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Rangpur SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Rangpur',
            districtBn: 'রংপুর',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320180000',
            dutyOfficer: '0521-62288',
            address: 'Rangpur Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-din-kotwali',
            name: 'Dinajpur Kotwali Police Station',
            nameBn: 'দিনাজপুর কোতয়ালী থানা',
            thana: 'Dinajpur Sadar',
            thanaBn: 'দিনাজপুর সদর',
            district: 'Dinajpur',
            districtBn: 'দিনাজপুর',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320182500',
            dutyOfficer: '01320182510',
            address: 'Dinajpur Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-kur-sadar',
            name: 'Kurigram Sadar Police Station',
            nameBn: 'কুড়িগ্রাম সদর থানা',
            thana: 'Kurigram Sadar',
            thanaBn: 'কুড়িগ্রাম সদর',
            district: 'Kurigram',
            districtBn: 'কুড়িগ্রাম',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320184500',
            dutyOfficer: '01320184510',
            address: 'Kurigram Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-gai-sadar',
            name: 'Gaibandha Sadar Police Station',
            nameBn: 'গাইবান্ধা সদর থানা',
            thana: 'Gaibandha Sadar',
            thanaBn: 'গাইবান্ধা সদর',
            district: 'Gaibandha',
            districtBn: 'গাইবান্ধা',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320186500',
            dutyOfficer: '01320186510',
            address: 'Gaibandha Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-nil-sadar',
            name: 'Nilphamari Sadar Police Station',
            nameBn: 'নীলফামারী সদর থানা',
            thana: 'Nilphamari Sadar',
            thanaBn: 'নীলফামারী সদর',
            district: 'Nilphamari',
            districtBn: 'নীলফামারী',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320188500',
            dutyOfficer: '01320188510',
            address: 'Nilphamari Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-tha-sadar',
            name: 'Thakurgaon Sadar Police Station',
            nameBn: 'ঠাকুরগাঁও সদর থানা',
            thana: 'Thakurgaon Sadar',
            thanaBn: 'ঠাকুরগাঁও সদর',
            district: 'Thakurgaon',
            districtBn: 'ঠাকুরগাঁও',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320190500',
            dutyOfficer: '01320190510',
            address: 'Thakurgaon Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-pan-sadar',
            name: 'Panchagarh Sadar Police Station',
            nameBn: 'পঞ্চগড় সদর থানা',
            thana: 'Panchagarh Sadar',
            thanaBn: 'পঞ্চগড় সদর',
            district: 'Panchagarh',
            districtBn: 'পঞ্চগড়',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320192500',
            dutyOfficer: '01320192510',
            address: 'Panchagarh Sadar',
            type: 'Border District Thana'
        },
        {
            id: 'pol-lal-sadar',
            name: 'Lalmonirhat Sadar Police Station',
            nameBn: 'লালমনিরহাট সদর থানা',
            thana: 'Lalmonirhat Sadar',
            thanaBn: 'লালমনিরহাট সদর',
            district: 'Lalmonirhat',
            districtBn: 'লালমনিরহাট',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            phone: '01320194500',
            dutyOfficer: '01320194510',
            address: 'Lalmonirhat Sadar',
            type: 'District Thana'
        },

        // --- Mymensingh Division ---
        {
            id: 'pol-mym-kotwali',
            name: 'Kotwali Model Police Station (Mymensingh)',
            nameBn: 'কোতয়ালী মডেল থানা, ময়মনসিংহ',
            thana: 'Kotwali Mymensingh',
            thanaBn: 'কোতয়ালী ময়মনসিংহ',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320196500',
            dutyOfficer: '01320196510',
            address: 'Choto Bazar, Mymensingh',
            type: 'District Model Thana'
        },
        {
            id: 'pol-mym-trishal',
            name: 'Trishal Police Station (Mymensingh)',
            nameBn: 'ত্রিশাল থানা, ময়মনসিংহ জেলা',
            thana: 'Trishal',
            thanaBn: 'ত্রিশাল',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320196550',
            dutyOfficer: '01320196560',
            address: 'Trishal Bazar, Mymensingh',
            type: 'District Model Thana'
        },
        {
            id: 'pol-mym-muktagacha',
            name: 'Muktagacha Police Station',
            nameBn: 'মুক্তাগাছা থানা, ময়মনসিংহ',
            thana: 'Muktagacha',
            thanaBn: 'মুক্তাগাছা',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320196600',
            dutyOfficer: '01320196610',
            address: 'Muktagacha Sadar',
            type: 'District Thana'
        },
        {
            id: 'pol-mym-bhaluka',
            name: 'Bhaluka Model Police Station',
            nameBn: 'ভালুকা মডেল থানা, ময়মনসিংহ',
            thana: 'Bhaluka',
            thanaBn: 'ভালুকা',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320196650',
            dutyOfficer: '01320196660',
            address: 'Bhaluka Industrial Belt',
            type: 'Industrial Model Thana'
        },
        {
            id: 'pol-mym-sp',
            name: 'Mymensingh District Police SP Office',
            nameBn: 'ময়মনসিংহ জেলা পুলিশ সুপার (এসপি) কার্যালয়',
            thana: 'Mymensingh SP Office',
            thanaBn: 'জেলা এসপি কার্যালয়',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320196000',
            dutyOfficer: '091-66444',
            address: 'Mymensingh Police Lines',
            type: 'Superintendent of Police (SP)'
        },
        {
            id: 'pol-jam-sadar',
            name: 'Jamalpur Sadar Police Station',
            nameBn: 'জামালপুর সদর থানা',
            thana: 'Jamalpur Sadar',
            thanaBn: 'জামালপুর সদর',
            district: 'Jamalpur',
            districtBn: 'জামালপুর',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320198500',
            dutyOfficer: '01320198510',
            address: 'Jamalpur Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-net-sadar',
            name: 'Netrokona Model Police Station',
            nameBn: 'নেত্রকোণা মডেল থানা',
            thana: 'Netrokona Sadar',
            thanaBn: 'নেত্রকোণা সদর',
            district: 'Netrokona',
            districtBn: 'নেত্রকোণা',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320200500',
            dutyOfficer: '01320200510',
            address: 'Netrokona Sadar',
            type: 'District Model Thana'
        },
        {
            id: 'pol-she-sadar',
            name: 'Sherpur Sadar Police Station',
            nameBn: 'শেরপুর সদর থানা',
            thana: 'Sherpur Sadar',
            thanaBn: 'শেরপুর সদর',
            district: 'Sherpur',
            districtBn: 'শেরপুর',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            phone: '01320202500',
            dutyOfficer: '01320202510',
            address: 'Sherpur Sadar',
            type: 'District Thana'
        }
    ];

    // High-Resolution Cadastral Land & Survey Photo Gallery Dataset
    const DEFAULT_GALLERY_PHOTOS = [
        {
            id: 'gal-1',
            titleEn: 'Aman Rice Paddies in Uttara Basin',
            titleBn: 'উত্তরা অববাহিকার সবুজ আমন ধানের ক্ষেত',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Uttara, Dhaka (DAG-8842)',
            locationBn: 'উত্তরা, ঢাকা (দাগ-৮৮৪২)',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'High-precision cadastral demarcated alluvial paddy field with satellite GPS mapping.',
            descriptionBn: 'উচ্চ নির্ভুল ক্যাডাস্ট্রাল দাগ চিহ্নিত পলিমাটির ধানের ক্ষেত ও স্যাটেলাইট জিপিএস ম্যাপিং।'
        },
        {
            id: 'gal-2',
            titleEn: 'Commercial Agro Farm Plantation',
            titleBn: 'বাণিজ্যিক কৃষি খামার ও সেচ প্রকল্প',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Joydebpur, Gazipur (DAG-4521)',
            locationBn: 'জয়দেবপুর, গাজীপুর (দাগ-৪৫২১)',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Modern sugarcane and agro plantation tract under automated sprinkler irrigation.',
            descriptionBn: 'স্বয়ংক্রিয় স্প্রিংকলার সেচ প্রকল্পের অধীনে আধুনিক আখ ও কৃষি খামার।'
        },
        {
            id: 'gal-3',
            titleEn: 'Hilly Slope Tea Garden Cadastre',
            titleBn: 'পাহাড়ী ঢালের বিস্তীর্ণ চা বাগান',
            category: 'Tea Estate',
            categoryBn: 'চা বাগান',
            location: 'Pahartali, Chittagong (DAG-3312)',
            locationBn: 'পাহাড়তলী, চট্টগ্রাম (দাগ-৩৩১২)',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Contour boundary surveyed tea estate verified by Chittagong Land Revenue Bureau.',
            descriptionBn: 'চট্টগ্রাম ভূমি রাজস্ব ব্যুরো কর্তৃক যাচাইকৃত কন্ট্যুর সীমানা জরিপকৃত চা বাগান।'
        },
        {
            id: 'gal-4',
            titleEn: 'Cadastral Surveyor with GPS RTK Rover',
            titleBn: 'জিপিএস আরটিকে সার্ভেয়ার দ্বারা মাঠ জরিপ',
            category: 'Survey',
            categoryBn: 'মাঠ জরিপ',
            location: 'National Survey Operations, Dhaka',
            locationBn: 'জাতীয় জরিপ কার্যক্রম, ঢাকা',
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Licensed land surveyors deploying millimeter RTK geodetic equipment on plot corners.',
            descriptionBn: 'প্লটের সীমানা নির্ধারণে মিলিমিটার নির্ভুল আরটিকে জিওডেটিক যন্ত্রের ব্যবহার।'
        },
        {
            id: 'gal-5',
            titleEn: 'Aerial Drone Cadastral Mapping',
            titleBn: 'ড্রোন ক্যামেরায় প্লটের আকাশ দৃশ্য ও ম্যাপিং',
            category: 'Aerial Drone',
            categoryBn: 'ড্রোন ম্যাপিং',
            location: 'Dumuria Basin, Khulna (DAG-6234)',
            locationBn: 'ডুমুরিয়া অববাহিকা, খুলনা (দাগ-৬২৩৪)',
            image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Orthomosaic photogrammetry capture mapping land boundaries with sub-decimeter precision.',
            descriptionBn: 'জমির আইল ও দাগ নির্ধারণে উচ্চ রেজ্যুলেশন অর্থোমোজাইক ড্রোন ফটোগ্রাফি।'
        },
        {
            id: 'gal-6',
            titleEn: 'Golden Boro Harvest Valley',
            titleBn: 'সোনালী বোরো ফসলের বিস্তীর্ণ মাঠ',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Surma River Basin, Sylhet (DAG-1088)',
            locationBn: 'সুরমা নদী তীরবর্তী এলাকা, সিলেট (দাগ-১০৮৮)',
            image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Ripening grain crops along Surma river certified by District Agriculture Extension.',
            descriptionBn: 'সুরমা নদী অববাহিকায় সোনালী বোরো ধানের মাঠ যা কৃষি সম্প্রসারণ অধিদপ্তর অনুমোদিত।'
        },
        {
            id: 'gal-7',
            titleEn: 'Mustard Blossom Golden Fields',
            titleBn: 'হলুদ সরিষা ফুলের মনোরম মাঠ',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Mainamati Heritage, Comilla (DAG-7729)',
            locationBn: 'ময়নামতি ঐতিহ্যবাহী সীমানা, কুমিল্লা (দাগ-৭৭২৯)',
            image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Seasonal yellow mustard bloom in surveyed agricultural plots near Mainamati.',
            descriptionBn: 'ময়নামতির সংলগ্ন জরিপকৃত কৃষি জমিতে হলুদ সরিষা ফুলের মনোমুগ্ধকর বিস্তার।'
        },
        {
            id: 'gal-8',
            titleEn: 'High-Yield Mango Orchard Tract',
            titleBn: 'উচ্চ ফলনশীল আম বাগান ও উদ্যান',
            category: 'Orchard',
            categoryBn: 'ফলজ বাগান',
            location: 'Paba, Rajshahi (DAG-5510)',
            locationBn: 'পবা, রাজশাহী (দাগ-৫৫১০)',
            image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Certified Fazli and Langra mango trees on fertile alluvium in Rajshahi.',
            descriptionBn: 'রাজশাহীর উর্বর মাটিতে ফজলি ও ল্যাংড়া আমের সুবিন্যস্ত ফলজ বাগান।'
        },
        {
            id: 'gal-9',
            titleEn: 'Commercial Greenhouse & High-Tech Farming',
            titleBn: 'আধুনিক গ্রীনহাউস ও নিয়ন্ত্রিত কৃষি প্লট',
            category: 'Commercial',
            categoryBn: 'বাণিজ্যিক প্লট',
            location: 'Trishal Agro Belt, Mymensingh (DAG-9043)',
            locationBn: 'ত্রিশাল কৃষি বলয়, ময়মনসিংহ (দাগ-৯০৪৩)',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Climate-controlled hydroponics and seed propagation facility with registered deed.',
            descriptionBn: 'নিবন্ধিত দলিলের আওতায় নিয়ন্ত্রিত পরিবেশের আধুনিক কৃষি ও চারা উৎপাদন খামার।'
        },
        {
            id: 'gal-10',
            titleEn: 'Vegetable Farm near Highway Corridor',
            titleBn: 'টঙ্গী মহাসড়ক সংলগ্ন সবজি খামার',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Tongi Industrial Zone, Dhaka (DAG-9104)',
            locationBn: 'টঙ্গী শিল্পাঞ্চল, ঢাকা (দাগ-৯১০৪)',
            image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Fast-cycle commercial vegetable plantation supplying fresh produce to Dhaka metro.',
            descriptionBn: 'রাজধানী ঢাকায় দ্রুত শাকসবজি সরবরাহের জন্য বাণিজ্যিক সবজি খামার।'
        },
        {
            id: 'gal-11',
            titleEn: 'Rural Homestead & Farm Demarcation',
            titleBn: 'গ্রামীণ বসতভিটা ও ফসলি জমির সীমানা',
            category: 'Cadastral',
            categoryBn: 'ক্যাডাস্ট্রাল সীমানা',
            location: 'Shibganj, Bogra (DAG-2198)',
            locationBn: 'শিবগঞ্জ, বগুড়া (দাগ-২১৯৮)',
            image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Traditional village homestead with adjacent vegetable and winter crop fields.',
            descriptionBn: 'বগুড়ার শিবগঞ্জে ঐতিহ্যবাহী গ্রামীণ বসতভিটা ও সংলগ্ন রবি ফসলের আইল সীমানা।'
        },
        {
            id: 'gal-12',
            titleEn: 'Riverside Alluvial Farmland Boundary',
            titleBn: 'নদী তীরবর্তী পলিমাটির কৃষিজমির সীমানা',
            category: 'Agricultural',
            categoryBn: 'কৃষি জমি',
            location: 'Babuganj, Barisal (DAG-3801)',
            locationBn: 'বাবুগঞ্জ, বরিশাল (দাগ-৩৮০১)',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            descriptionEn: 'Fertile river delta boundary plots with annual alluvial soil enrichment.',
            descriptionBn: 'প্রতিবছর নতুন পলিসমৃদ্ধ নদী তীরবর্তী উর্বর কৃষিজমি ও সীমানা নির্ধারণ।'
        }
    ];

    // =========================================================================
    // Comprehensive District Land & Agriculture Officers Dataset (সকল জেলা ও বিভাগ)
    // =========================================================================
    const DEFAULT_LAND_OFFICIALS = [
        // --- Dhaka Division ---
        {
            id: 'off-dhk-acland-sadar',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড',
            officerNameEn: 'Md. Ashraful Alam, BCS (Admin)',
            officerNameBn: 'মুহাম্মদ আশরাফুল আলম, বিসিএস (প্রশাসন)',
            phone: '01712034567',
            landline: '02-9556781',
            email: 'acland.dhakasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Dhaka',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, ঢাকা',
            servicesEn: 'E-Mutation (নামজারি), DCR & Khajna Dakhila, Record Corrections, Boundary Demarcation Hearings',
            servicesBn: 'ই-নামজারি (Mutation), ডিসিআর ও খাজনা দাখিলা, খতিয়ান ও দাগ সংশোধন, মিসকেস শুনানি ও সীমানা বিরোধ নিষ্পত্তি।'
        },
        {
            id: 'off-dhk-subreg-sadar',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Sub-Registrar (Sadar Land Records)',
            titleBn: 'সাব-রেজিস্ট্রার (সদর ভূমি রেজিস্ট্রি অফিস)',
            officerNameEn: 'Md. Zahirul Islam, BCS (Registration)',
            officerNameBn: 'মোঃ জহিরুল ইসলাম, বিসিএস (রেজিস্ট্রেশন)',
            phone: '01819234567',
            landline: '02-9562211',
            email: 'subreg.dhaka@registration.gov.bd',
            officeEn: 'Sub-Registry Office, Sadar Record Complex, Dhaka',
            officeBn: 'সাব-রেজিস্ট্রি অফিস, সদর রেকর্ড কমপ্লেক্স, ঢাকা',
            servicesEn: 'Saf-Kabla Deed Registration, Certified Deed Copies (নকল), Deed Searching Certificate (তল্লাশি)',
            servicesBn: 'সাফ-কবলা দলিল রেজিস্ট্রি, হেবা ও দানপত্র, মূল দলিলের সার্টিফাইড নকল প্রদান এবং বায়নানামা সম্পাদন।'
        },
        {
            id: 'off-dhk-dae-dd',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর (খামারবাড়ি)',
            officerNameEn: 'Dr. Rafiqul Islam, BCS (Agri)',
            officerNameBn: 'ড. মুহাম্মদ রফিকুল ইসলাম, বিসিএস (কৃষি)',
            phone: '01711892345',
            landline: '02-58153401',
            email: 'dd.dhaka@dae.gov.bd',
            officeEn: 'Khamarbari District Agriculture Complex, Farmgate, Dhaka',
            officeBn: 'খামারবাড়ি জেলা কৃষি কমপ্লেক্স, ফার্মগেট, ঢাকা',
            servicesEn: 'Commercial Crop Planning, Free Agro Incentives, Pest Epidemic Advisory, 4% Low-Interest Agri Loan',
            servicesBn: 'বাণিজ্যিক ফসল পরিকল্পনা, সরকারি বিনামূল্যে সার-বীজ প্রণোদনা, বালাই দমন পরামর্শ ও ৪% রেয়াতি কৃষি ঋণ সুপারিশ।'
        },
        {
            id: 'off-dhk-savar-uao',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Upazila Agriculture Officer (UAO)',
            titleBn: 'উপজেলা কৃষি অফিসার (সাভার)',
            officerNameEn: 'Naznin Sultana, BCS (Agri)',
            officerNameBn: 'নাজনীন সুলতানা, বিসিএস (কৃষি)',
            phone: '01715432198',
            landline: '02-7742110',
            email: 'uao.savar@dae.gov.bd',
            officeEn: 'Upazila Agriculture Office, Savar, Dhaka',
            officeBn: 'উপজেলা কৃষি অফিস, সাভার, ঢাকা',
            servicesEn: 'Soil Fertility Testing (pH/NPK), Organic Fertilizer Certification, High-Value Vegetable Cultivation',
            servicesBn: 'মাটি পরীক্ষা ও সার সুপারিশ কার্ড, ড্রিপ সেচ প্রযুক্তি, জৈব কৃষি সনদ ও আধুনিক ফলদ বাগান স্থাপনে সহায়তা।'
        },
        {
            id: 'off-gzp-acland-sadar',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (গাজীপুর সদর)',
            officerNameEn: 'Tanvir Ahmed, BCS (Admin)',
            officerNameBn: 'তানভীর আহমেদ, বিসিএস (প্রশাসন)',
            phone: '01713987654',
            landline: '02-9261234',
            email: 'acland.gazipursdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Joydebpur, Gazipur',
            officeBn: 'উপজেলা ভূমি অফিস, জয়দেবপুর, গাজীপুর',
            servicesEn: 'Mutation Case Disposal, CS/SA/RS/BRS Record Clarification, Industrial/Agri Land Demarcation',
            servicesBn: 'ই-নামজারি ও জমাভাগ, সিএস/এসএ/আরএস/বিআরএস রেকর্ড যাচাই, শিল্প ও কৃষি জমির সীমানা বিরোধ নিষ্পত্তি।'
        },
        {
            id: 'off-gzp-dae-dd',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Dr. Mahbubur Rahman, BCS (Agri)',
            officerNameBn: 'ড. মাহবুবুর রহমান, বিসিএস (কৃষি)',
            phone: '01712456789',
            landline: '02-9252345',
            email: 'dd.gazipur@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Joydebpur, Gazipur',
            officeBn: 'জেলা কৃষি অফিস কমপ্লেক্স, জয়দেবপুর, গাজীপুর',
            servicesEn: 'SRDI Soil Lab Coordination, Greenhouse Horticulture, Organic Compost Advisory',
            servicesBn: 'এসআরডিআই (SRDI) মৃত্তিকা ল্যাব টেস্ট, গ্রিনহাউস প্রযুক্তি, আধুনিক পলিনেট হাউজ ও উচ্চমূল্যের ফল বাগান গাইড।'
        },
        {
            id: 'off-ngj-acland-sadar',
            division: 'Dhaka',
            divisionBn: 'ঢাকা',
            district: 'Narayanganj',
            districtBn: 'নারায়ণগঞ্জ',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (নারায়ণগঞ্জ সদর)',
            officerNameEn: 'Farhana Akter, BCS (Admin)',
            officerNameBn: 'ফারহানা আক্তার, বিসিএস (প্রশাসন)',
            phone: '01714123890',
            landline: '02-7645123',
            email: 'acland.narayanganjsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Chashara, Narayanganj',
            officeBn: 'উপজেলা ভূমি অফিস, চাষাড়া, নারায়ণগঞ্জ',
            servicesEn: 'E-Mutation, Riverbank Boundary Clarification, DCR Issuance, Commercial Land Conversion',
            servicesBn: 'ই-নামজারি, শীতলক্ষ্যা নদী তীরবর্তী জমি সীমানা নির্ধারণ, ডিসিআর প্রদান এবং জমির শ্রেণি পরিবর্তন যাচাই।'
        },

        // --- Chattogram Division ---
        {
            id: 'off-ctg-acland-sadar',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Chattogram',
            districtBn: 'চট্টগ্রাম',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (কোতোয়ালী সার্কেল)',
            officerNameEn: 'Md. Fakhrul Islam, BCS (Admin)',
            officerNameBn: 'মোঃ ফখরুল ইসলাম, বিসিএস (প্রশাসন)',
            phone: '01716543210',
            landline: '031-612345',
            email: 'acland.kotwali.ctg@land.gov.bd',
            officeEn: 'Circle Land Office, Kotwali, Chattogram',
            officeBn: 'সার্কেল ভূমি অফিস, কোতোয়ালী, চট্টগ্রাম',
            servicesEn: 'Chittagong Hill/Plain Land Verification, E-Mutation, Mouza Demarcation, CS to BRS Correction',
            servicesBn: 'ই-নামজারি, পাহাড় ও সমতল ভূমি রেকর্ড যাচাই, খতিয়ান সংশোধন এবং মৌজা ম্যাপ অনুযায়ী সীমানা নির্ধারণ।'
        },
        {
            id: 'off-ctg-subreg-sadar',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Chattogram',
            districtBn: 'চট্টগ্রাম',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Sub-Registrar (Sadar Registration)',
            titleBn: 'সাব-রেজিস্ট্রার (সদর রেজিস্ট্রি অফিস)',
            officerNameEn: 'Ahmed Ullah, BCS (Registration)',
            officerNameBn: 'আহমেদ উল্লাহ, বিসিএস (রেজিস্ট্রেশন)',
            phone: '01817654321',
            landline: '031-623456',
            email: 'subreg.ctg@registration.gov.bd',
            officeEn: 'District Registry Complex, Court Hill, Chattogram',
            officeBn: 'জেলা রেজিস্ট্রি কমপ্লেক্স, কোর্ট হিল, চট্টগ্রাম',
            servicesEn: 'Sale Deed Execution, Partition Deeds, Power of Attorney Registration, Record Verification',
            servicesBn: 'সাফ-কবলা জমি রেজিস্ট্রি, বণ্টননামা ও হেবা দলিল সম্পাদন, আমমোক্তারনামা নিবন্ধন এবং মূল দলিল নকল প্রদান।'
        },
        {
            id: 'off-ctg-dae-dd',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Chattogram',
            districtBn: 'চট্টগ্রাম',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Nasir Uddin, BCS (Agri)',
            officerNameBn: 'মোঃ নাসির উদ্দিন, বিসিএস (কৃষি)',
            phone: '01711987654',
            landline: '031-634567',
            email: 'dd.chittagong@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Dampara, Chattogram',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, দামপাড়া, চট্টগ্রাম',
            servicesEn: 'Coastal Crop Planning, Salinity-Tolerant Rice Seed Distribution, Hill Fruit Orchard Guidance',
            servicesBn: 'উপকূলীয় কৃষি পরিকল্পনা, লবণাক্ততাসহিষ্ণু ধানের জাত বিতরণ, পাহাড়ি ফল বাগান তৈরি ও কীটনাশক পরামর্শ।'
        },
        {
            id: 'off-cox-acland-sadar',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Cox\'s Bazar',
            districtBn: 'কক্সবাজার',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (কক্সবাজার সদর)',
            officerNameEn: 'Md. Rakibul Hasan, BCS (Admin)',
            officerNameBn: 'মোঃ রাকিবুল হাসান, বিসিএস (প্রশাসন)',
            phone: '01718765432',
            landline: '0341-62211',
            email: 'acland.coxsbazarsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Cox\'s Bazar',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, কক্সবাজার',
            servicesEn: 'Coastal Zone Land Clearance, Mutation Hearing, Tourist Zone Zoning Clearance',
            servicesBn: 'উপকূলীয় পর্যটন জোনিং যাচাই, ই-নামজারি, খাসজমি সীমানা চিহ্নিতকরণ ও লবণ মাঠ রেকর্ড পরীক্ষণ।'
        },
        {
            id: 'off-com-acland-sadar',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Cumilla',
            districtBn: 'কুমিল্লা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (কুমিল্লা আদর্শ সদর)',
            officerNameEn: 'Syed Nazmul Hasan, BCS (Admin)',
            officerNameBn: 'সৈয়দ নাজমুল হাসান, বিসিএস (প্রশাসন)',
            phone: '01715678901',
            landline: '081-65432',
            email: 'acland.cumillasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Adarsha Sadar, Cumilla',
            officeBn: 'উপজেলা ভূমি অফিস, আদর্শ সদর, কুমিল্লা',
            servicesEn: 'E-Mutation, High-Yield Alluvial Land Demarcation, Khajna Online Pay Help',
            servicesBn: 'অনলাইন ই-নামজারি, উর্বর সমতল কৃষিজমির সীমানা নির্ধারণ, ভূমি উন্নয়ন কর আদায় ও খতিয়ান প্রদান।'
        },
        {
            id: 'off-com-dae-dd',
            division: 'Chittagong',
            divisionBn: 'চট্টগ্রাম',
            district: 'Cumilla',
            districtBn: 'কুমিল্লা',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Ayub Hossain, BCS (Agri)',
            officerNameBn: 'মোঃ আইয়ুব হোসেন, বিসিএস (কৃষি)',
            phone: '01713456780',
            landline: '081-67890',
            email: 'dd.cumilla@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Shashangachha, Cumilla',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, শাসনগাছা, কুমিল্লা',
            servicesEn: 'Boro Rice Modern Seeds, Vegetable Cluster Support, IPM Biological Pest Control',
            servicesBn: 'উচ্চফলনশীল বোরো ধান প্রযুক্তি, সবজি ক্লাস্টার উন্নয়ন, আইপিএম বালাই দমন এবং ৪% কৃষি ঋণ সুবিধা।'
        },

        // --- Rajshahi Division ---
        {
            id: 'off-raj-acland-sadar',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (রাজশাহী বোয়ালিয়া সার্কেল)',
            officerNameEn: 'Md. Sazzad Hossain, BCS (Admin)',
            officerNameBn: 'মুহাম্মদ সাজ্জাদ হোসেন, বিসিএস (প্রশাসন)',
            phone: '01717890123',
            landline: '0721-772345',
            email: 'acland.boalia@land.gov.bd',
            officeEn: 'Circle Land Office, Boalia, Rajshahi',
            officeBn: 'সার্কেল ভূমি অফিস, বোয়ালিয়া, রাজশাহী',
            servicesEn: 'Orchard Land Mutation, Padma Char Demarcation, DCR Issuance, Dispute Conciliation',
            servicesBn: 'আমবাগান ও ফলদ জমির ই-নামজারি, পদ্মা চরাঞ্চল সীমানা জরিপ, ডিসিআর প্রদান এবং মিসকেস নিষ্পত্তি।'
        },
        {
            id: 'off-raj-subreg-sadar',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Sub-Registrar (Sadar Land Records)',
            titleBn: 'সাব-রেজিস্ট্রার (সদর রেজিস্ট্রি অফিস)',
            officerNameEn: 'Md. Mahmudur Rahman, BCS (Registration)',
            officerNameBn: 'মোঃ মাহমুদুর রহমান, বিসিএস (রেজিস্ট্রেশন)',
            phone: '01815678901',
            landline: '0721-773456',
            email: 'subreg.rajshahi@registration.gov.bd',
            officeEn: 'Sub-Registry Office, Court Area, Rajshahi',
            officeBn: 'সাব-রেজিস্ট্রি অফিস, কোর্ট চত্বর, রাজশাহী',
            servicesEn: 'Deed Registration, Non-Encumbrance Search (দায়মুক্ত সনদ), Certified Copy Delivery',
            servicesBn: 'সাফ-কবলা জমি রেজিস্ট্রি, বায়নানামা, দায়মুক্ত তল্লাশি সনদ (NEC) এবং দলিলের অবিকল নকল সরবরাহ।'
        },
        {
            id: 'off-raj-dae-dd',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Dr. Mozaffar Hossain, BCS (Agri)',
            officerNameBn: 'ড. মোজাফফর হোসেন, বিসিএস (কৃষি)',
            phone: '01712340987',
            landline: '0721-774567',
            email: 'dd.rajshahi@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Sopura, Rajshahi',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, সপুরা, রাজশাহী',
            servicesEn: 'Mango Orchard Technology, Barind Deep-Aquifer Drip Irrigation, Soil pH Amelioration',
            servicesBn: 'আম ও ড্রাগন বাগানের আধুনিক পরিচর্যা, বরেন্দ্র ড্রিপ সেচ প্রযুক্তি, মাটি পরীক্ষা ও সার সুপারিশ কার্ড।'
        },
        {
            id: 'off-bog-acland-sadar',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            district: 'Bogura',
            districtBn: 'বগুড়া',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (বগুড়া সদর)',
            officerNameEn: 'Md. Shahadat Hossain, BCS (Admin)',
            officerNameBn: 'মোঃ শাহাদাত হোসেন, বিসিএস (প্রশাসন)',
            phone: '01716781234',
            landline: '051-66234',
            email: 'acland.bogurasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Bogura',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, বগুড়া',
            servicesEn: 'Intensive Agri Plot Mutation, Khatian Separation, Boundary Dispute Resolution',
            servicesBn: 'উচ্চফলনশীল সবজি জমির ই-নামজারি, খতিয়ান পৃথকীকরণ, জমি মাপজোক ও সীমানা বিরোধের দ্রুত নিষ্পত্তি।'
        },
        {
            id: 'off-bog-dae-dd',
            division: 'Rajshahi',
            divisionBn: 'রাজশাহী',
            district: 'Bogura',
            districtBn: 'বগুড়া',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Enamul Haque, BCS (Agri)',
            officerNameBn: 'মোঃ এনামুল হক, বিসিএস (কৃষি)',
            phone: '01711234560',
            landline: '051-67345',
            email: 'dd.bogura@dae.gov.bd',
            officeEn: 'District Agriculture Office, Thanthania, Bogura',
            officeBn: 'জেলা কৃষি অফিস, বনানী/ঠনঠনিয়া, বগুড়া',
            servicesEn: 'Chili & Potato Seed Production Hub, Agro Farm Registration, Organic Bio-Fertilizer Subsidy',
            servicesBn: 'মরিচ ও আলু বীজ উৎপাদন প্রযুক্তি, বাণিজ্যিক ফার্ম নিবন্ধন এবং জৈব বালাইনাশক প্রণোদনা কর্মসূচি।'
        },

        // --- Khulna Division ---
        {
            id: 'off-khu-acland-sadar',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            district: 'Khulna',
            districtBn: 'খুলনা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (খুলনা সদর)',
            officerNameEn: 'Sheikh Maruf Hasan, BCS (Admin)',
            officerNameBn: 'শেখ মারুফ হাসান, বিসিএস (প্রশাসন)',
            phone: '01719876543',
            landline: '041-721234',
            email: 'acland.khulnasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Boyra, Khulna',
            officeBn: 'উপজেলা ভূমি অফিস, বয়রা, খুলনা',
            servicesEn: 'Aquaculture Gher Land Mutation, Coastal Land Classification, DCR Collection',
            servicesBn: 'চিংড়ি ঘের ও মৎস্য খামার জমির ই-নামজারি, জমি শ্রেণি পরিবর্তন যাচাই ও মৌজা ম্যাপ অনুযায়ী সীমানা পিলার।'
        },
        {
            id: 'off-khu-dae-dd',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            district: 'Khulna',
            districtBn: 'খুলনা',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Hafizur Rahman, BCS (Agri)',
            officerNameBn: 'মোঃ হাফিজুর রহমান, বিসিএস (কৃষি)',
            phone: '01712987123',
            landline: '041-732345',
            email: 'dd.khulna@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Daulatpur, Khulna',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, দৌলতপুর, খুলনা',
            servicesEn: 'Salinity Mitigation in Soils, Gher Dyke Vegetable Cultivation, Soil Testing by SRDI',
            servicesBn: 'মাটির লবণাক্ততা নিয়ন্ত্রণ, ঘেরের আইলে সবজি চাষ মডেল, এসআরডিআই মাটি পরীক্ষা ও ৪% কৃষি ঋণ সুবিধা।'
        },
        {
            id: 'off-jas-acland-sadar',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            district: 'Jashore',
            districtBn: 'যশোর',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (যশোর সদর)',
            officerNameEn: 'Md. Anisur Rahman, BCS (Admin)',
            officerNameBn: 'মোঃ আনিসুর রহমান, বিসিএস (প্রশাসন)',
            phone: '01713459876',
            landline: '0421-65432',
            email: 'acland.jashoresdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Kotwali, Jashore',
            officeBn: 'উপজেলা ভূমি অফিস, কোতোয়ালী, যশোর',
            servicesEn: 'Flower & High-Value Agro Plot Mutation, Demarcation, Certified Records',
            servicesBn: 'ফুল ও আধুনিক ফলদ কৃষি জমির ই-নামজারি, খতিয়ান রেকর্ড সংশোধন ও সীমানা বিরোধের তাৎক্ষণিক নিষ্পত্তি।'
        },
        {
            id: 'off-jas-dae-dd',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            district: 'Jashore',
            districtBn: 'যশোর',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Sanjay Kumar Sarkar, BCS (Agri)',
            officerNameBn: 'সঞ্জয় কুমার সরকার, বিসিএস (কৃষি)',
            phone: '01711876543',
            landline: '0421-66543',
            email: 'dd.jashore@dae.gov.bd',
            officeEn: 'District Agriculture Office, Monihar, Jashore',
            officeBn: 'জেলা কৃষি অফিস, মনিহার, যশোর',
            servicesEn: 'Commercial Floriculture (Gadkhali Model), Safe Vegetable Export Guidance',
            servicesBn: 'বাণিজ্যিক ফুল চাষ ও রফতানি গাইড (গদখালী মডেল), বিষমুক্ত নিরাপদ সবজি চাষ ও জৈব সার প্রণোদনা।'
        },
        {
            id: 'off-kus-acland-sadar',
            division: 'Khulna',
            divisionBn: 'খুলনা',
            district: 'Kushtia',
            districtBn: 'কুষ্টিয়া',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (কুষ্টিয়া সদর)',
            officerNameEn: 'Md. Ariful Islam, BCS (Admin)',
            officerNameBn: 'মোঃ আরিফুল ইসলাম, বিসিএস (প্রশাসন)',
            phone: '01718902345',
            landline: '071-62345',
            email: 'acland.kushtiasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Kushtia',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, কুষ্টিয়া',
            servicesEn: 'Ganges-Kobadak (GK) Canal-Side Land Mutation, Survey Verification, DCR Issuance',
            servicesBn: 'জিকে ক্যানেল তীরবর্তী কৃষিজমির ই-নামজারি, জরিপ রেকর্ড যাচাই ও সীমানা প্রাচীর নির্ধারণ।'
        },

        // --- Barishal Division ---
        {
            id: 'off-bar-acland-sadar',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            district: 'Barishal',
            districtBn: 'বরিশাল',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (বরিশাল সদর)',
            officerNameEn: 'Md. Touhidul Islam, BCS (Admin)',
            officerNameBn: 'মোঃ তৌহিদুল ইসলাম, বিসিএস (প্রশাসন)',
            phone: '01712345678',
            landline: '0431-217345',
            email: 'acland.barishalsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Band Road, Barishal',
            officeBn: 'উপজেলা ভূমি অফিস, ব্যান্ড রোড, বরিশাল',
            servicesEn: 'River Alluvium (পয়স্তি) & Diluvium (শিকস্তি) Land Records, E-Mutation, Mouza Demarcation',
            servicesBn: 'নদী ভাঙন ও পয়স্তি জমির রেকর্ড যাচাই, ই-নামজারি, খতিয়ান সংশোধন এবং মৌজা ম্যাপ সীমানা চিহ্নিতকরণ।'
        },
        {
            id: 'off-bar-subreg-sadar',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            district: 'Barishal',
            districtBn: 'বরিশাল',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Sub-Registrar (Sadar Land Records)',
            titleBn: 'সাব-রেজিস্ট্রার (সদর সাব-রেজিস্ট্রি অফিস)',
            officerNameEn: 'Abul Kalam Azad, BCS (Registration)',
            officerNameBn: 'আবুল কালাম আজাদ, বিসিএস (রেজিস্ট্রেশন)',
            phone: '01819345678',
            landline: '0431-218456',
            email: 'subreg.barishal@registration.gov.bd',
            officeEn: 'Sub-Registry Office, Court Compound, Barishal',
            officeBn: 'সাব-রেজিস্ট্রি অফিস, কোর্ট কম্পাউন্ড, বরিশাল',
            servicesEn: 'Deed Registration, Non-Encumbrance Verification, Certified Deed Copy',
            servicesBn: 'সাফ-কবলা জমি রেজিস্ট্রি, হেবা ও বণ্টননামা দলিল সম্পাদন এবং তল্লাশি সনদ (দায়মুক্ত প্রত্যয়ন)।'
        },
        {
            id: 'off-bar-dae-dd',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            district: 'Barishal',
            districtBn: 'বরিশাল',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Muhsinul Karim, BCS (Agri)',
            officerNameBn: 'মুহসিনুল করিম, বিসিএস (কৃষি)',
            phone: '01711239876',
            landline: '0431-219567',
            email: 'dd.barishal@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Alekanda, Barishal',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, আলেকান্দা, বরিশাল',
            servicesEn: 'Floating Agriculture Guidance (ধাপ চাষ), Guava & Amra Orchard Planning, 4% Agri-Loan',
            servicesBn: 'ভাসমান সবজি ও চারা উৎপাদন প্রযুক্তি (ধাপ চাষ), পেয়ারা ও আমড়া বাগান পরিচর্যা ও ৪% রেয়াতি ঋণ।'
        },
        {
            id: 'off-pat-acland-sadar',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            district: 'Patuakhali',
            districtBn: 'পটুয়াখালী',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (পটুয়াখালী সদর)',
            officerNameEn: 'Md. Asaduzzaman, BCS (Admin)',
            officerNameBn: 'মোঃ আসাদুজ্জামান, বিসিএস (প্রশাসন)',
            phone: '01716123450',
            landline: '0441-62345',
            email: 'acland.patuakhalisdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Patuakhali',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, পটুয়াখালী',
            servicesEn: 'Coastal Embankment Plot Mutation, Khatian Separation, DCR Issuance',
            servicesBn: 'উপকূলীয় বেড়িবাঁধ পার্শ্ববর্তী জমি ই-নামজারি, খতিয়ান পৃথকীকরণ এবং সরকারি রেকর্ড হালনাগাদ।'
        },
        {
            id: 'off-bho-acland-sadar',
            division: 'Barisal',
            divisionBn: 'বরিশাল',
            district: 'Bhola',
            districtBn: 'ভোলা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (ভোলা সদর)',
            officerNameEn: 'Md. Zahid Hasan, BCS (Admin)',
            officerNameBn: 'মোঃ জাহিদ হাসান, বিসিএস (প্রশাসন)',
            phone: '01717654320',
            landline: '0491-61234',
            email: 'acland.bholasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Bhola',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, ভোলা',
            servicesEn: 'Island / Char Land Boundary Settlement, E-Mutation, Waterbody Classification',
            servicesBn: 'দ্বীপ ও চরাঞ্চল ভূমি সীমানা নির্ধারণ, ই-নামজারি ও মিসকেস নিষ্পত্তি এবং খতিয়ান সংশোধন।'
        },

        // --- Sylhet Division ---
        {
            id: 'off-syl-acland-sadar',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (সিলেট সদর)',
            officerNameEn: 'Md. Sadequr Rahman, BCS (Admin)',
            officerNameBn: 'মোঃ সাদেকুর রহমান, বিসিএস (প্রশাসন)',
            phone: '01714567890',
            landline: '0821-712345',
            email: 'acland.sylhetsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Sylhet',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, সিলেট',
            servicesEn: 'Tila / Hill Land Clearance, Expatriate Land Protection, E-Mutation, Boundary Demarcation',
            servicesBn: 'টিলা ও পাহাড়ি জমি সুরক্ষা, প্রবাসী নাগরিকদের জমি সংক্রান্ত অভিযোগ নিষ্পত্তি, ই-নামজারি ও সীমানা নির্ধারণ।'
        },
        {
            id: 'off-syl-dae-dd',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            district: 'Sylhet',
            districtBn: 'সিলেট',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Dr. Amalendu Biswas, BCS (Agri)',
            officerNameBn: 'ড. অমলেন্দু বিশ্বাস, বিসিএস (কৃষি)',
            phone: '01713210987',
            landline: '0821-723456',
            email: 'dd.sylhet@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Ambarkhana, Sylhet',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, আম্বরখানা, সিলেট',
            servicesEn: 'Acidic Soil Neutralization (Lime Application), Orange/Malta Orchard Planning, Haor Boro Safety',
            servicesBn: 'অ্যাসিডিক মাটির চুন প্রয়োগ ও পিএইচ ব্যালেন্স, কমলার বাগান সম্প্রসারণ ও আগাম হাওর বোরো ধান সুরক্ষা।'
        },
        {
            id: 'off-mou-acland-sadar',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            district: 'Moulvibazar',
            districtBn: 'মৌলভীবাজার',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (মৌলভীবাজার সদর)',
            officerNameEn: 'Md. Kamrul Hasan, BCS (Admin)',
            officerNameBn: 'মোঃ কামরুল হাসান, বিসিএস (প্রশাসন)',
            phone: '01715670123',
            landline: '0861-52345',
            email: 'acland.moulvibazarsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Moulvibazar',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, মৌলভীবাজার',
            servicesEn: 'Tea Estate Border Demarcation, E-Mutation, DCR Issuance, Non-Resident Land Grievance Cell',
            servicesBn: 'চা বাগান সংলগ্ন জোত জমির ই-নামজারি, প্রবাসীদের ভূমি সংক্রান্ত মিসকেস শুনানি ও সীমানা প্রাচীর পরিদর্শন।'
        },
        {
            id: 'off-hab-acland-sadar',
            division: 'Sylhet',
            divisionBn: 'সিলেট',
            district: 'Habiganj',
            districtBn: 'হবিগঞ্জ',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (হবিগঞ্জ সদর)',
            officerNameEn: 'Md. Robiul Islam, BCS (Admin)',
            officerNameBn: 'মোঃ রবিউল ইসলাম, বিসিএস (প্রশাসন)',
            phone: '01716789012',
            landline: '0831-61234',
            email: 'acland.habiganjsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Habiganj',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, হবিগঞ্জ',
            servicesEn: 'Haor Land Record Verification, E-Mutation, Land Tax Assessment, Khatian Delivery',
            servicesBn: 'হাওর বেসিন জমির খতিয়ান যাচাই, ই-নামজারি, ভূমি উন্নয়ন কর নির্ধারণ ও সার্টিফাইড পর্চা প্রদান।'
        },

        // --- Rangpur Division ---
        {
            id: 'off-rng-acland-sadar',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            district: 'Rangpur',
            districtBn: 'রংপুর',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (রংপুর সদর)',
            officerNameEn: 'Md. Delowar Hossain, BCS (Admin)',
            officerNameBn: 'মোঃ দেলোয়ার হোসেন, বিসিএস (প্রশাসন)',
            phone: '01718901234',
            landline: '0521-63456',
            email: 'acland.rangpursdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Rangpur',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, রংপুর',
            servicesEn: 'E-Mutation, Tista Basin Plot Boundary Demarcation, DCR & Online Khajna Receipt',
            servicesBn: 'অনলাইন ই-নামজারি, তিস্তা অববাহিকা কৃষিজমি সীমানা পিলার স্থাপন, ডিসিআর ও দাখিলা রশিদ প্রদান।'
        },
        {
            id: 'off-rng-dae-dd',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            district: 'Rangpur',
            districtBn: 'রংপুর',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Obaidur Rahman, BCS (Agri)',
            officerNameBn: 'মোঃ ওবায়দুর রহমান, বিসিএস (কৃষি)',
            phone: '01712345098',
            landline: '0521-64567',
            email: 'dd.rangpur@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Radha Ballabh, Rangpur',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, রাধা বল্লভ, রংপুর',
            servicesEn: 'Cold Wave Crop Protection, Potato & Maize Seed Selection, 4% Low-Interest Agri Loan',
            servicesBn: 'শৈত্যপ্রবাহে ফসলের সুরক্ষা পরামর্শ, আলু ও ভুট্টা চাষ ক্লাস্টার এবং ৪% রেয়াতি সুদের কৃষি ঋণ সহায়তা।'
        },
        {
            id: 'off-din-acland-sadar',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            district: 'Dinajpur',
            districtBn: 'দিনাজপুর',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (দিনাজপুর সদর)',
            officerNameEn: 'Md. Ashiqur Rahman, BCS (Admin)',
            officerNameBn: 'মোঃ আশিকুর রহমান, বিসিএস (প্রশাসন)',
            phone: '01715678123',
            landline: '0531-65432',
            email: 'acland.dinajpursdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Dinajpur',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, দিনাজপুর',
            servicesEn: 'Litchi Orchard Land Record Verification, E-Mutation, CS/RS/BRS Reconciliation',
            servicesBn: 'লিচু বাগান ও উর্বর ধানি জমির ই-নামজারি, সিএস/আরএস/বিআরএস রেকর্ড সমম্বয় ও খাজনা পরিশোধ।'
        },
        {
            id: 'off-kur-acland-sadar',
            division: 'Rangpur',
            divisionBn: 'রংপুর',
            district: 'Kurigram',
            districtBn: 'কুড়িগ্রাম',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (কুড়িগ্রাম সদর)',
            officerNameEn: 'Md. Mahbub Alam, BCS (Admin)',
            officerNameBn: 'মোঃ মাহবুব আলম, বিসিএস (প্রশাসন)',
            phone: '01717890456',
            landline: '0581-61234',
            email: 'acland.kurigramsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Kurigram',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, কুড়িগ্রাম',
            servicesEn: 'Dharla/Brahmaputra Char Mutation, Erosion Record Management, Land Disput Hearing',
            servicesBn: 'ব্রহ্মপুত্র ও ধরলা নদী চরাঞ্চল জমির ই-নামজারি, ভাঙনকবলিত খতিয়ান হালনাগাদ ও মিসকেস শুনানি।'
        },

        // --- Mymensingh Division ---
        {
            id: 'off-mym-acland-sadar',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (ময়মনসিংহ সদর)',
            officerNameEn: 'Md. Tariqul Islam, BCS (Admin)',
            officerNameBn: 'মোঃ তরিকুল ইসলাম, বিসিএস (প্রশাসন)',
            phone: '01716549870',
            landline: '091-65432',
            email: 'acland.mymensinghsdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Mymensingh',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, ময়মনসিংহ',
            servicesEn: 'Fishery & Farm Plot Mutation, Old Khatian Separation, Brahmaputra Basin Demarcation',
            servicesBn: 'বাণিজ্যিক মৎস্য খামার ও কৃষি প্লটের ই-নামজারি, পুরাতন খতিয়ান সংশোধন ও সীমানা বিরোধ নিষ্পত্তি।'
        },
        {
            id: 'off-mym-dae-dd',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            sector: 'agriculture',
            sectorBn: 'কৃষি সম্প্রসারণ ও মৃত্তিকা',
            titleEn: 'Deputy Director (DAE)',
            titleBn: 'উপ-পরিচালক, কৃষি সম্প্রসারণ অধিদপ্তর',
            officerNameEn: 'Md. Motiur Rahman, BCS (Agri)',
            officerNameBn: 'মোঃ মতিউর রহমান, বিসিএস (কৃষি)',
            phone: '01712349012',
            landline: '091-66543',
            email: 'dd.mymensingh@dae.gov.bd',
            officeEn: 'District Agriculture Complex, Mashkanda, Mymensingh',
            officeBn: 'জেলা কৃষি কমপ্লেক্স, মাসকান্দা, ময়মনসিংহ',
            servicesEn: 'BAU Technology Adoption, Integrated Rice-Fish Farming, Organic Soil Enrichment',
            servicesBn: 'বাকৃবি (BAU) আধুনিক কৃষি প্রযুক্তি সম্প্রসারণ, সমন্বিত মাছ-ধান চাষ মডেল ও জৈব সার প্রণোদনা।'
        },
        {
            id: 'off-jam-acland-sadar',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            district: 'Jamalpur',
            districtBn: 'জামালপুর',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (জামালপুর সদর)',
            officerNameEn: 'Md. Farhad Hossain, BCS (Admin)',
            officerNameBn: 'মোঃ ফরহাদ হোসেন, বিসিএস (প্রশাসন)',
            phone: '01718906543',
            landline: '0981-62345',
            email: 'acland.jamalpursdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Jamalpur',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, জামালপুর',
            servicesEn: 'Char Land Boundary Survey, E-Mutation, DCR Delivery, Record Verification',
            servicesBn: 'যমুনা নদী চরাঞ্চল জমির ই-নামজারি, মৌজা ম্যাপ অনুযায়ী সীমানা নির্ধারণ ও সরকারি রেকর্ড হালনাগাদ।'
        },
        {
            id: 'off-net-acland-sadar',
            division: 'Mymensingh',
            divisionBn: 'ময়মনসিংহ',
            district: 'Netrokona',
            districtBn: 'নেত্রকোণা',
            sector: 'land',
            sectorBn: 'ভূমি প্রশাসন ও রেজিস্ট্রি',
            titleEn: 'Assistant Commissioner (Land) - AC Land',
            titleBn: 'সহকারী কমিশনার (ভূমি) - এসি ল্যান্ড (নেত্রকোণা সদর)',
            officerNameEn: 'Md. Sajedul Karim, BCS (Admin)',
            officerNameBn: 'মোঃ সাজেদুল করিম, বিসিএস (প্রশাসন)',
            phone: '01714561230',
            landline: '0951-61234',
            email: 'acland.netrokonasdr@land.gov.bd',
            officeEn: 'Upazila Land Office, Sadar, Netrokona',
            officeBn: 'উপজেলা ভূমি অফিস, সদর, নেত্রকোণা',
            servicesEn: 'Haor Land Boundary Settlement, E-Mutation, Khatian Correction, Tax Receipt',
            servicesBn: 'হাওর অঞ্চলের কৃষিজমির ই-নামজারি, খতিয়ান সংশোধন, জলমহাল সীমানা বিরোধের শুনানি ও দাখিলা প্রদান।'
        }
    ];

    // =========================================================================
    // Agricultural Weather Center Dataset (কৃষি আবহাওয়া ও জলবায়ু কেন্দ্র)
    // =========================================================================
    const DEFAULT_DISTRICT_WEATHER = {
        'Dhaka': {
            district: 'Dhaka',
            districtBn: 'ঢাকা',
            division: 'Dhaka',
            temp: 29,
            feelsLike: 31,
            conditionEn: 'Partly Cloudy & Pleasant',
            conditionBn: 'আংশিক মেঘলা ও মনোরম আবহাওয়া',
            icon: 'fa-cloud-sun',
            humidity: '64%',
            rainChance: '15%',
            wind: '12 km/h SE',
            uvIndex: '6 (Moderate)',
            soilMoisture: '৫৮% (পর্যাপ্ত আর্দ্রতা)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 115 (গ্রহণযোগ্য)',
            agriAdvisory: {
                cropAdviceBn: 'সবজি নার্সারি বেড তৈরি ও রবি ফসলের বীজ বপনের জন্য অনুকূল আবহাওয়া। জমিতে হালকা সেচ দিন এবং দুপুরে অতিরিক্ত রোদ থেকে কচি চারা সুরক্ষায় শেড ব্যবহার করুন।',
                cropAdviceEn: 'Favorable condition for vegetable nursery bed preparation and rabi seedling transplanting. Maintain light furrow irrigation and protect tender saplings with shade netting.',
                sprayAlertBn: 'আজ সকাল ১০টা থেকে দুপুর ২টার মধ্যে বালাইনাশক ও ভিটামিন স্প্রে করার জন্য সবচেয়ে উপযুক্ত আবহাওয়া (বাতাসের বেগ অনুকূল)।',
                sprayAlertEn: 'Optimal weather window for foliar fertilizer and pesticide spraying between 10:00 AM and 2:00 PM due to low wind speed.',
                specialAlertBn: 'বৃষ্টির সম্ভাবনা মাত্র ১৫%, তাই সেচ পরিকল্পনা অব্যাহত রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-cloud-sun', maxTemp: 30, minTemp: 22, rainChance: '15%', adviceBn: 'হালকা সেচ ও আগাছা পরিষ্কারের উপযুক্ত সময়।', adviceEn: 'Light irrigation and weeding recommended.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 31, minTemp: 23, rainChance: '10%', adviceBn: 'ফসলে পটাশ ও ইউরিয়া সার উপরিপ্রয়োগের আদর্শ দিন।', adviceEn: 'Ideal day for top-dressing urea/potash fertilizers.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud', maxTemp: 29, minTemp: 21, rainChance: '25%', adviceBn: 'মেঘলা আবহাওয়ায় পোকামাকড়ের আক্রমণ পর্যবেক্ষণ করুন।', adviceEn: 'Scout crops for sucking pests during overcast skies.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-rain', maxTemp: 27, minTemp: 20, rainChance: '45%', adviceBn: 'হালকা বৃষ্টির সম্ভাবনা, সেচ দেওয়া থেকে বিরত থাকুন।', adviceEn: 'Light rain expected, pause furrow irrigation.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 21, rainChance: '20%', adviceBn: 'জমি নিড়ানি ও মাটি আলগা করে দিন।', adviceEn: 'Hoeing and aeration around plant bases.' }
            ]
        },
        'Gazipur': {
            district: 'Gazipur',
            districtBn: 'গাজীপুর',
            division: 'Dhaka',
            temp: 28,
            feelsLike: 30,
            conditionEn: 'Clear Sky & Breezy',
            conditionBn: 'পরিষ্কার আকাশ ও শান্ত বাতাস',
            icon: 'fa-sun',
            humidity: '60%',
            rainChance: '10%',
            wind: '10 km/h S',
            uvIndex: '7 (High)',
            soilMoisture: '৫৫% (মধ্যম)',
            soilTemp: '২৬°C',
            airQuality: 'AQI 98 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'ফলদ বাগান (পেয়ারা, ড্রাগন, আম) ও শীতকালীন সবজিতে নিয়মিত নিড়ানি ও ড্রিপ সেচ দিন। ফলন্ত গাছে অনুখাদ্য (বোরন ও জিংক) স্প্রে করুন।',
                cropAdviceEn: 'Perform weeding and drip irrigation in commercial orchards. Apply foliar micronutrients (boron & zinc) to bearing fruit trees.',
                sprayAlertBn: 'পরিষ্কার রৌদ্রোজ্জ্বল আবহাওয়া বিরাজ করছে। ছত্রাকনাশক স্প্রে করার জন্য আজ অত্যন্ত কার্যকর দিন।',
                sprayAlertEn: 'Sunny and dry climate. Highly effective for systemic fungicide spraying.',
                specialAlertBn: 'মাটির তাপমাত্রা ২৬°C, যা নতুন চারা রোপণের জন্য অত্যন্ত উপযোগী।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 29, minTemp: 21, rainChance: '10%', adviceBn: 'নতুন চারা রোপণ ও ড্রিপ সেচ চালু রাখুন।', adviceEn: 'Planting new saplings and drip irrigation.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 30, minTemp: 22, rainChance: '10%', adviceBn: 'জৈব কম্পোস্ট ও খৈল প্রয়োগ করুন।', adviceEn: 'Apply vermicompost and mustard oil-cake.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 20, rainChance: '20%', adviceBn: 'সবজি মাচায় ফেরোমোন ট্র্যাপ স্থাপন করুন।', adviceEn: 'Install sex pheromone traps in trellis crops.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 20, rainChance: '20%', adviceBn: 'গাছের গোড়ায় মাটি তুলে দিন।', adviceEn: 'Earthing up around crop roots.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 29, minTemp: 21, rainChance: '15%', adviceBn: 'ফল সংগ্রহ ও গ্রেডিং করুন।', adviceEn: 'Harvest mature fruits and sort for market.' }
            ]
        },
        'Chattogram': {
            district: 'Chattogram',
            districtBn: 'চট্টগ্রাম',
            division: 'Chittagong',
            temp: 30,
            feelsLike: 34,
            conditionEn: 'Humid Coastal Breeze',
            conditionBn: 'আর্দ্র উপকূলীয় বাতাস ও আংশিক মেঘলা',
            icon: 'fa-cloud-sun',
            humidity: '76%',
            rainChance: '30%',
            wind: '18 km/h S',
            uvIndex: '8 (Very High)',
            soilMoisture: '৬৫% (উচ্চ আর্দ্রতা)',
            soilTemp: '২৭°C',
            airQuality: 'AQI 82 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'উপকূলীয় পাহাড়ি অঞ্চলে লেবু, মাল্টা ও আদার ক্ষেতে নিকাশি নালা তৈরি রাখুন যাতে বৃষ্টির অতিরিক্ত পানি দ্রুত নিষ্কাশিত হতে পারে।',
                cropAdviceEn: 'Maintain drainage furrows in hill slope citrus and ginger crops to prevent moisture stagnation after coastal showers.',
                sprayAlertBn: 'বাতাসের বেগ তুলনামূলক বেশি থাকায় সকাল ৮টা থেকে ১০টার মধ্যে স্প্রে সম্পন্ন করুন।',
                sprayAlertEn: 'Due to gusty coastal breeze, complete pesticide spraying early morning between 8:00 AM and 10:00 AM.',
                specialAlertBn: 'বাতাসের আর্দ্রতা ৭৬%, ফলে ডাউনি মিলডিউ বা ছত্রাক সংক্রমণের ঝুঁকি এড়াতে সতর্ক থাকুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-cloud-sun', maxTemp: 31, minTemp: 24, rainChance: '30%', adviceBn: 'ক্ষেতের নিষ্কাশন নালা পরিষ্কার রাখুন।', adviceEn: 'Keep field drainage furrows unblocked.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-cloud-rain', maxTemp: 29, minTemp: 23, rainChance: '50%', adviceBn: 'বজ্রবৃষ্টির সম্ভাবনা, সেচ দেওয়া বন্ধ রাখুন।', adviceEn: 'Rain showers likely, halt furrow irrigation.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-showers-heavy', maxTemp: 28, minTemp: 22, rainChance: '65%', adviceBn: 'পানি নিষ্কাশন ও ফসলের আশ্রয় নিশ্চিত করুন।', adviceEn: 'Drain waterlogged plots immediately.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 30, minTemp: 23, rainChance: '25%', adviceBn: 'ক্ষতিগ্রস্ত ডালপালা ছাঁটাই করুন।', adviceEn: 'Prune damaged branches and apply copper oxychloride.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 31, minTemp: 24, rainChance: '15%', adviceBn: 'ফলন তোলা ও বাজারে পাঠানোর প্রস্তুতি নিন।', adviceEn: 'Harvest ready produce for commercial market.' }
            ]
        },
        'Rajshahi': {
            district: 'Rajshahi',
            districtBn: 'রাজশাহী',
            division: 'Rajshahi',
            temp: 31,
            feelsLike: 32,
            conditionEn: 'Dry & Sunny Barind Weather',
            conditionBn: 'শুষ্ক ও রৌদ্রোজ্জ্বল বরেন্দ্র আবহাওয়া',
            icon: 'fa-sun',
            humidity: '48%',
            rainChance: '5%',
            wind: '14 km/h NW',
            uvIndex: '8 (Very High)',
            soilMoisture: '৪২% (কম আর্দ্রতা - সেচ আবশ্যক)',
            soilTemp: '২৮°C',
            airQuality: 'AQI 90 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'বরেন্দ্র অঞ্চলের লাল মাটিতে আর্দ্রতা দ্রুত হ্রাস পায়। আমবাগান ও সবজি প্লটে পর্যাপ্ত বেসিন সেচ দিন এবং মালচিং (Mulching) ব্যবহার করে মাটির আর্দ্রতা ধরে রাখুন।',
                cropAdviceEn: 'Soil moisture depletes quickly in Barind loamy soils. Apply circular basin irrigation and straw mulching to conserve root-zone water.',
                sprayAlertBn: 'দিনের বেলা প্রখর রোদ থাকে। সকাল ৯টার পূর্বে অথবা বিকেল ৪টার পর স্প্রে করুন।',
                sprayAlertEn: 'Intense sunlight during midday. Perform spray applications before 9:00 AM or after 4:00 PM.',
                specialAlertBn: 'মাটির আর্দ্রতা মাত্র ৪২%, তাই ড্রিপ সেচ অবিলম্বে চালু করা জরুরি।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 32, minTemp: 19, rainChance: '5%', adviceBn: 'মালচিং ও গভীর সেচ নিশ্চিত করুন।', adviceEn: 'Apply thick straw mulching & root irrigation.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 32, minTemp: 20, rainChance: '5%', adviceBn: 'আমবাগানে হপার ও মিলিবাগ বালাই দমন করুন।', adviceEn: 'Control mango hopper and mealybug pests.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-sun', maxTemp: 33, minTemp: 20, rainChance: '10%', adviceBn: 'ফলদ গাছের কাণ্ডে চুন ও বর্দো পেস্ট প্রলেপ দিন।', adviceEn: 'Apply Bordeaux white paste to tree trunks.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 31, minTemp: 19, rainChance: '15%', adviceBn: 'আন্তঃফসল হিসেবে ডাল চাষের জমি তৈরি করুন।', adviceEn: 'Prepare land for intercropped pulses.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 31, minTemp: 19, rainChance: '10%', adviceBn: 'সেচ পাম্প ও ড্রিপ ফিল্টার সার্ভিসিং করুন।', adviceEn: 'Service irrigation pumps and drip filters.' }
            ]
        },
        'Khulna': {
            district: 'Khulna',
            districtBn: 'খুলনা',
            division: 'Khulna',
            temp: 29,
            feelsLike: 32,
            conditionEn: 'Moderate Humidity & Breezy',
            conditionBn: 'সহনীয় আর্দ্রতা ও মৃদু হাওয়া',
            icon: 'fa-cloud-sun',
            humidity: '72%',
            rainChance: '20%',
            wind: '14 km/h S',
            uvIndex: '7 (High)',
            soilMoisture: '৬৪% (পর্যাপ্ত)',
            soilTemp: '২৬°C',
            airQuality: 'AQI 78 (উত্তম)',
            agriAdvisory: {
                cropAdviceBn: 'ঘেরের পাড়ে লাউ, মিষ্টি কুমড়া ও শিম চাষে নিয়মিত খৈল ও জৈব সার দিন। ঘেরের পানির লবণাক্ততা ও অম্লতা (pH) নিয়মিত পরীক্ষা করুন।',
                cropAdviceEn: 'Fertilize gher dyke gourds and climbing beans with oil-cake slurry. Monitor aquaculture water salinity and pH daily.',
                sprayAlertBn: 'বিকেলের দিকে বাতাসের আর্দ্রতা অনুকূল থাকবে। মৎস্য খামারের সংলগ্ন ফসলে শুধু বায়ো-পেস্টিসাইড ব্যবহার করুন।',
                sprayAlertEn: 'Use only biological/organic pesticides near aquaculture ponds to prevent fish toxicity.',
                specialAlertBn: 'উপকূলীয় জোয়ারের পানি বৃদ্ধি পেলে ঘেরের নেট ও বাঁধ মজবুত রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-cloud-sun', maxTemp: 30, minTemp: 23, rainChance: '20%', adviceBn: 'ঘেরের আইল সবজিতে বালাই দমন করুন।', adviceEn: 'Inspect gher dyke vegetables for insect borers.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 31, minTemp: 23, rainChance: '15%', adviceBn: 'ঘেরের পানিতে চুন ও জিওলাইট প্রয়োগ করুন।', adviceEn: 'Apply agricultural lime and zeolite in ponds.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 30, minTemp: 22, rainChance: '25%', adviceBn: 'সবজির মাচায় বাঁশের খুঁটি মেরামত করুন।', adviceEn: 'Reinforce bamboo trellises against coastal wind.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-rain', maxTemp: 28, minTemp: 21, rainChance: '40%', adviceBn: 'হালকা বৃষ্টির পানি ধরে রাখার ব্যবস্থা নিন।', adviceEn: 'Harvest rainwater for post-monsoon irrigation.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-cloud-sun', maxTemp: 29, minTemp: 22, rainChance: '20%', adviceBn: 'চিংড়ি ও মাছের খাদ্য পরিমিত দিন।', adviceEn: 'Adjust fish feed ratio as per water temperature.' }
            ]
        },
        'Barishal': {
            district: 'Barishal',
            districtBn: 'বরিশাল',
            division: 'Barisal',
            temp: 29,
            feelsLike: 32,
            conditionEn: 'Tropical Riverine Climate',
            conditionBn: 'নদীমাতৃক ক্রান্তীয় আবহাওয়া',
            icon: 'fa-cloud-sun',
            humidity: '75%',
            rainChance: '25%',
            wind: '15 km/h S',
            uvIndex: '7 (High)',
            soilMoisture: '৬৮% (উচ্চ ও উর্বর আর্দ্রতা)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 65 (উত্তম)',
            agriAdvisory: {
                cropAdviceBn: 'নতুন পলিসমৃদ্ধ দোআঁশ মাটিতে রবি ডাল (মুগ, খেসারি) ও তরমুজের বীজ বপনের জন্য উৎকৃষ্ট সময়। ধাপ চাষের ভাসমান বেড প্রস্তুত রাখুন।',
                cropAdviceEn: 'Excellent condition for sowing rabi pulses (mungbean, khesari) and watermelon in fertile alluvial silt. Keep floating seedling beds ready.',
                sprayAlertBn: 'সকাল ৯টা থেকে দুপুর ১২টার মধ্যে বালাইনাশক প্রয়োগের উপযুক্ত আবহাওয়া।',
                sprayAlertEn: 'Spray window open from 9:00 AM to 12:00 PM for maximum systemic absorption.',
                specialAlertBn: 'নদীর জোয়ারের পানি স্বাভাবিক উচ্চতায় রয়েছে, কোনো আকস্মিক প্লাবনের শঙ্কা নেই।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-cloud-sun', maxTemp: 30, minTemp: 23, rainChance: '25%', adviceBn: 'ডাল ও রবি শস্যের বীজ শোধন করে বপন করুন।', adviceEn: 'Treat pulse seeds with fungicide before sowing.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 31, minTemp: 23, rainChance: '15%', adviceBn: 'পেয়ারা ও আমড়া বাগানে আগাছা নিড়ান।', adviceEn: 'Weed around guava and hog plum root zones.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud', maxTemp: 29, minTemp: 22, rainChance: '30%', adviceBn: 'ভাসমান ধাপ বেডে জৈব সার দিন।', adviceEn: 'Add aquatic weed compost to floating seedbeds.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-rain', maxTemp: 28, minTemp: 21, rainChance: '45%', adviceBn: 'হালকা বৃষ্টির সম্ভাবনা, সেচ ড্রেন সচল রাখুন।', adviceEn: 'Light coastal shower probable, clear drains.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 30, minTemp: 22, rainChance: '20%', adviceBn: 'পান বরজে ছত্রাকজনিত পচন প্রতিরোধ স্প্রে দিন।', adviceEn: 'Spray bio-fungicide in betel vine sheds.' }
            ]
        },
        'Sylhet': {
            district: 'Sylhet',
            districtBn: 'সিলেট',
            division: 'Sylhet',
            temp: 27,
            feelsLike: 29,
            conditionEn: 'Lush Hilly Mist & Pleasant',
            conditionBn: 'পাহাড়ি কুয়াশাচ্ছন্ন ও স্নিগ্ধ আবহাওয়া',
            icon: 'fa-cloud',
            humidity: '78%',
            rainChance: '35%',
            wind: '11 km/h NE',
            uvIndex: '6 (Moderate)',
            soilMoisture: '৭২% (উচ্চ আর্দ্রতা)',
            soilTemp: '২৩°C',
            airQuality: 'AQI 55 (অত্যন্ত বিশুদ্ধ)',
            agriAdvisory: {
                cropAdviceBn: 'টিলা ও পাহাড়ি ঢালে কমলা, মাল্টা ও লেবু বাগানে গোড়া পচা রোগ এড়াতে কাণ্ডের চারপাশে পানি জমতে দেবেন না। মাটির অম্লতা কমাতে ডলোমাইট চুন প্রয়োগ করুন।',
                cropAdviceEn: 'Prevent water stagnation near citrus bases to avoid collar rot. Apply agricultural dolomite lime to balance soil acidity (pH 5.5-6.5).',
                sprayAlertBn: 'সকালে কুয়াশা কেটে যাওয়ার পর রৌদ্রোজ্জ্বল সময়ে স্প্রে করুন। বৃষ্টির আগে কোনো স্প্রে করবেন না।',
                sprayAlertEn: 'Wait until morning mist clears completely before spraying. Do not spray if afternoon rain is imminent.',
                specialAlertBn: 'মাটির আর্দ্রতা ৭২%, হাওর বোরো বীজতলায় পানির স্তর ২ ইঞ্চি বজায় রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-cloud', maxTemp: 28, minTemp: 19, rainChance: '35%', adviceBn: 'টিলা বাগানে রিং ড্রেন তৈরি করুন।', adviceEn: 'Excavate contour ring trenches on slopes.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-cloud-rain', maxTemp: 27, minTemp: 18, rainChance: '50%', adviceBn: 'হাওর বোরো বীজতলা সুরক্ষায় পলিথিন শেড রাখুন।', adviceEn: 'Keep polythene covers ready for boro seedbeds.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 18, rainChance: '25%', adviceBn: 'কমলা বাগানে বোরাক্স ও দস্তা স্প্রে করুন।', adviceEn: 'Foliar spray borax and zinc sulfate in citrus.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-sun', maxTemp: 29, minTemp: 19, rainChance: '15%', adviceBn: 'আনারস ও লেবু সংগ্রহ করে বাজারজাত করুন।', adviceEn: 'Harvest ripe pineapples and lemons.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-cloud', maxTemp: 27, minTemp: 18, rainChance: '30%', adviceBn: 'মাটির অম্লতা পরীক্ষা করে চুন দিন।', adviceEn: 'Test soil pH and apply dolomite limestone.' }
            ]
        },
        'Rangpur': {
            district: 'Rangpur',
            districtBn: 'রংপুর',
            division: 'Rangpur',
            temp: 28,
            feelsLike: 29,
            conditionEn: 'Gentle Northern Breeze',
            conditionBn: 'উত্তরাঞ্চলের শান্ত আবহাওয়া',
            icon: 'fa-sun',
            humidity: '56%',
            rainChance: '5%',
            wind: '12 km/h N',
            uvIndex: '7 (High)',
            soilMoisture: '৫২% (পরিমিত)',
            soilTemp: '২৪°C',
            airQuality: 'AQI 72 (উত্তম)',
            agriAdvisory: {
                cropAdviceBn: 'আলু, ভুট্টা ও তামাক চাষের জমি প্রস্তুতের সর্বোৎকৃষ্ট মৌসুম। আলুর জমিতে পচন রোগ (Late Blight) প্রতিরোধে আগাম প্রস্তুতি নিন।',
                cropAdviceEn: 'Prime season for preparing seedbeds for potato, hybrid maize, and winter oilseeds. Monitor potato leaves proactively for late blight symptoms.',
                sprayAlertBn: 'পরিষ্কার আকাশ এবং বাতাসে আর্দ্রতা কম থাকায় সারাদিনই কীটনাশক স্প্রে করা সম্ভব।',
                sprayAlertEn: 'Clear blue skies and gentle northern breeze. Ideal for open-field foliar nutrient spraying all day.',
                specialAlertBn: 'রাতের তাপমাত্রা ১৮°C এ নেমে আসতে পারে, বীজতলায় সন্ধ্যার সময় স্বচ্ছ পলিথিন দিন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 29, minTemp: 18, rainChance: '5%', adviceBn: 'আলু বীজের সুপ্ততা ভাঙিয়ে জমিতে রোপণ করুন।', adviceEn: 'Sprout certified potato seed tubers and plant.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 29, minTemp: 18, rainChance: '5%', adviceBn: 'ভুট্টার জমিতে টিএসপি ও জিপসাম সার দিন।', adviceEn: 'Broadcast TSP and gypsum basal fertilizers.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-sun', maxTemp: 30, minTemp: 19, rainChance: '10%', adviceBn: 'তিস্তা চরাঞ্চলে বাদাম ও মিষ্টি আলুর যত্ন নিন।', adviceEn: 'Cultivate groundnut and sweet potato in char lands.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 17, rainChance: '15%', adviceBn: 'শীতকালীন শাকসবজি চাষে নিড়ানি দিন।', adviceEn: 'Hand-weed around winter vegetable rows.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 29, minTemp: 18, rainChance: '5%', adviceBn: 'সেচ নালা পরিষ্কার ও মেরামত করুন।', adviceEn: 'Reconstruct earthen irrigation channels.' }
            ]
        },
        'Mymensingh': {
            district: 'Mymensingh',
            districtBn: 'ময়মনসিংহ',
            division: 'Mymensingh',
            temp: 28,
            feelsLike: 30,
            conditionEn: 'Clear Sky & Favorable Weather',
            conditionBn: 'পরিষ্কার আকাশ ও ফসলবান্ধব আবহাওয়া',
            icon: 'fa-sun',
            humidity: '62%',
            rainChance: '10%',
            wind: '10 km/h SE',
            uvIndex: '7 (High)',
            soilMoisture: '৬০% (পর্যাপ্ত)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 85 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'বাণিজ্যিক মৎস্য খামারে শীতের আগমনে পানির গভীরতা ৫ ফুটের ওপরে রাখুন। সরিষা ও গম চাষের জন্য জমি চাষ দিয়ে প্রস্তুত করুন।',
                cropAdviceEn: 'Maintain aquaculture water depth above 5 feet to stabilize bottom temperatures. Till and prepare loamy soil for high-yield mustard.',
                sprayAlertBn: 'সকাল ১০টা থেকে দুপুর ২টার মধ্যে বালাইনাশক ও ভিটামিন স্প্রে করার সবচেয়ে ভালো সময়।',
                sprayAlertEn: 'Optimum spray window between 10:00 AM and 2:00 PM for superior canopy coverage.',
                specialAlertBn: 'মৎস্য খামারে অক্সিজেন লেভেল ঠিক রাখতে ভোরবেলা এরিয়েটর চালু রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 29, minTemp: 20, rainChance: '10%', adviceBn: 'উন্নত জাতের সরিষা (বারি-১৪/১৭) বপন করুন।', adviceEn: 'Sow high-yield BARI-14/17 mustard seeds.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 30, minTemp: 21, rainChance: '10%', adviceBn: 'মৎস্য খামারে চুন ও গোবর সার প্রয়োগ করুন।', adviceEn: 'Apply quicklime and processed organic manure.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 29, minTemp: 19, rainChance: '15%', adviceBn: 'সবজি ক্ষেতে মালচিং শিট বিছিয়ে দিন।', adviceEn: 'Spread silver-black plastic mulch in vegetable rows.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 28, minTemp: 19, rainChance: '20%', adviceBn: 'গম ও ডাল জাতীয় শস্যের জমি সমতল করুন।', adviceEn: 'Laser-level fields for wheat and pulse plots.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 29, minTemp: 20, rainChance: '10%', adviceBn: 'গাছের গোড়ায় মাটি দিয়ে সেচ দিন।', adviceEn: 'Ridge root zones and initiate furrow watering.' }
            ]
        },
        'Cumilla': {
            district: 'Cumilla',
            districtBn: 'কুমিল্লা',
            division: 'Chittagong',
            temp: 29,
            feelsLike: 31,
            conditionEn: 'Sunny & Mild Humid',
            conditionBn: 'রৌদ্রোজ্জ্বল ও মৃদু আর্দ্র',
            icon: 'fa-sun',
            humidity: '66%',
            rainChance: '15%',
            wind: '11 km/h S',
            uvIndex: '7 (High)',
            soilMoisture: '৫৮% (উত্তম)',
            soilTemp: '২৬°C',
            airQuality: 'AQI 88 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'গোমতী নদীর পলিসমৃদ্ধ জমিতে বাঁধাকপি, ফুলকপি ও টমেটো চারা রোপণের আদর্শ পরিবেশ। গোড়ায় রোগমুক্ত কম্পোস্ট সার প্রয়োগ করুন।',
                cropAdviceEn: 'Optimal environment for planting cauliflower, cabbage, and hybrid tomato seedlings along the Gomti alluvial basin.',
                sprayAlertBn: 'সকালবেলা রোদ উঠলে পোকা দমনে নিমের তৈল বা জৈব বালাইনাশক স্প্রে করুন।',
                sprayAlertEn: 'Spray botanical neem oil or organic bio-repellents during early morning sunny hours.',
                specialAlertBn: 'বৃষ্টির সম্ভাবনা কম, সবজি ক্ষেতে ৪ দিন অন্তর হালকা সেচ বজায় রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 30, minTemp: 21, rainChance: '15%', adviceBn: 'টমেটো ও ফুলকপির চারা রোপণ করুন।', adviceEn: 'Transplant healthy tomato and cole crop seedlings.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 31, minTemp: 22, rainChance: '10%', adviceBn: 'সবজি প্লটে ড্রিপ পাইপলাইন পরীক্ষা করুন।', adviceEn: 'Inspect drip micro-tubes and drippers for clogging.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 29, minTemp: 20, rainChance: '20%', adviceBn: 'পোকা প্রতিরোধে হলুদ আঠালো ফাঁদ লাগান।', adviceEn: 'Hang yellow sticky cards to trap whiteflies.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-sun', maxTemp: 30, minTemp: 21, rainChance: '15%', adviceBn: 'আলুর জমিতে মাটি তুলে দিন।', adviceEn: 'Earthing up potato ridges to prevent tuber greening.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 30, minTemp: 21, rainChance: '10%', adviceBn: 'ফসলে পটাশ ও ক্যালসিয়াম সার দিন।', adviceEn: 'Supply potassium and water-soluble calcium.' }
            ]
        },
        'Bogura': {
            district: 'Bogura',
            districtBn: 'বগুড়া',
            division: 'Rajshahi',
            temp: 29,
            feelsLike: 30,
            conditionEn: 'Sunny & Pleasant Agri Weather',
            conditionBn: 'রৌদ্রোজ্জ্বল ও প্রাণবন্ত কৃষি আবহাওয়া',
            icon: 'fa-sun',
            humidity: '55%',
            rainChance: '5%',
            wind: '12 km/h NW',
            uvIndex: '7 (High)',
            soilMoisture: '৫৩% (পরিমিত)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 80 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'মরিচ, লালশাক ও শীতকালীন সবজির ক্লাস্টারে মাটি নিড়ানি দিয়ে আলগা করুন। আলুর জমিতে আগাম সেচ দিয়ে চারা গজানো ত্বরান্বিত করুন।',
                cropAdviceEn: 'Aerate soil between chili, amaranth, and cole crop furrows. Apply uniform light watering to stimulate uniform potato sprouting.',
                sprayAlertBn: 'বাতাসের গতিবেগ কম থাকায় বালাইনাশক ও উদ্ভিজ্জ হরমোন স্প্রে করার আদর্শ সময়।',
                sprayAlertEn: 'Gentle wind speed. Ideal conditions for foliar plant growth regulator application.',
                specialAlertBn: 'মাটির উর্বরতা ভালো, ডিএপি ও এমপি সারের সুষম সংমিশ্রণ বজায় রাখুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 30, minTemp: 19, rainChance: '5%', adviceBn: 'মরিচ ও পেঁয়াজের চারা রোপণ করুন।', adviceEn: 'Transplant onion sets and chili seedlings.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 30, minTemp: 20, rainChance: '5%', adviceBn: 'জৈব সার ও ট্রাইকোডার্মা মাটিতে মেশান।', adviceEn: 'Incorporate Trichoderma-enriched compost into soil.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-sun', maxTemp: 31, minTemp: 20, rainChance: '10%', adviceBn: 'সবজি মাচায় নেট বেড়া শক্ত করুন।', adviceEn: 'Reinforce perimeter bird netting around vegetable crops.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-sun', maxTemp: 29, minTemp: 19, rainChance: '15%', adviceBn: 'আলু ক্ষেতে হালকা সেচ প্রদান করুন।', adviceEn: 'Provide shallow furrow irrigation to potato crops.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 30, minTemp: 19, rainChance: '5%', adviceBn: 'ফসলের গুণগত মান পরীক্ষা ও বাজারজাতকরণ।', adviceEn: 'Grade harvested fresh crops for high bazar prices.' }
            ]
        },
        'Cox\'s Bazar': {
            district: 'Cox\'s Bazar',
            districtBn: 'কক্সবাজার',
            division: 'Chittagong',
            temp: 31,
            feelsLike: 35,
            conditionEn: 'Sunny Coastal Weather',
            conditionBn: 'উষ্ণ উপকূলীয় ও রৌদ্রোজ্জ্বল আবহাওয়া',
            icon: 'fa-sun',
            humidity: '74%',
            rainChance: '25%',
            wind: '19 km/h S',
            uvIndex: '9 (Extreme)',
            soilMoisture: '৫৮% (মধ্যম)',
            soilTemp: '২৮°C',
            airQuality: 'AQI 58 (অত্যন্ত বিশুদ্ধ)',
            agriAdvisory: {
                cropAdviceBn: 'সুপারি বাগান, নারিকেল ও পান বরজে পর্যাপ্ত সেচ দিন। উপকূলীয় লবণাক্ততাহীন বেলে দোআঁশ মাটিতে তরমুজ চাষের প্রস্তুতি নিন।',
                cropAdviceEn: 'Ensure regular basin irrigation in betel nut, coconut, and paan sheds. Prepare coastal sandy loam plots for early watermelon beds.',
                sprayAlertBn: 'দুপুরের কড়া রোদ এড়িয়ে সকাল ৭টা থেকে ৯টার মধ্যে স্প্রে সম্পন্ন করুন।',
                sprayAlertEn: 'Avoid intense afternoon sun; complete foliar applications between 7:00 AM and 9:00 AM.',
                specialAlertBn: 'অতিবেগুনী রশ্মি (UV Index) অত্যন্ত উচ্চ (৯), খোলা মাঠে কৃষিকাজের সময় টুপি বা গামছা পরিধান করুন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 31, minTemp: 24, rainChance: '25%', adviceBn: 'সুপারি ও নারিকেলের গোড়ায় জৈব সার দিন।', adviceEn: 'Feed coconut & betel nut palms with potash and manure.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-cloud-sun', maxTemp: 31, minTemp: 24, rainChance: '30%', adviceBn: 'উপকূলীয় তরমুজের জমিতে বেড তৈরি করুন।', adviceEn: 'Shape raised beds for commercial watermelon crop.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-sun', maxTemp: 32, minTemp: 25, rainChance: '20%', adviceBn: 'পান বরজে পানি নিষ্কাশন ড্রেন সচল রাখুন।', adviceEn: 'Clear paan conservatory runoff channels.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-cloud-rain', maxTemp: 29, minTemp: 23, rainChance: '45%', adviceBn: 'হালকা বৃষ্টির পানি ধারণ ও সংরক্ষণ করুন।', adviceEn: 'Harvest fresh rainwater in farm ponds.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 31, minTemp: 24, rainChance: '15%', adviceBn: 'লবণাক্ততাহীন মিষ্টি পানির সেচ বজায় রাখুন।', adviceEn: 'Irrigate using sweet groundwater exclusively.' }
            ]
        },
        'Jashore': {
            district: 'Jashore',
            districtBn: 'যশোর',
            division: 'Khulna',
            temp: 29,
            feelsLike: 31,
            conditionEn: 'Sunny & Floriculture Friendly',
            conditionBn: 'রৌদ্রোজ্জ্বল ও ফুল চাষ উপযোগী আবহাওয়া',
            icon: 'fa-sun',
            humidity: '58%',
            rainChance: '10%',
            wind: '11 km/h S',
            uvIndex: '7 (High)',
            soilMoisture: '৫৭% (পর্যাপ্ত)',
            soilTemp: '২৫°C',
            airQuality: 'AQI 82 (ভালো)',
            agriAdvisory: {
                cropAdviceBn: 'গদখালী ও পার্শ্ববর্তী অঞ্চলের গোলাপ, রজনীগন্ধা ও জারবেরা ফুলের জমিতে কুঁড়ি সুরক্ষায় অনুখাদ্য স্প্রে করুন। সবজি রপ্তানি জোনে নিরাপদ কীটনাশক ব্যবহার করুন।',
                cropAdviceEn: 'Foliar feed commercial cut-flowers (rose, tuberose, gerbera) with calcium-boron for sturdy stems. Follow GAP export guidelines.',
                sprayAlertBn: 'সকাল ৯টা থেকে দুপুর ১২টার মধ্যে ফুলবাগানে ছত্রাকনাশক স্প্রে করুন।',
                sprayAlertEn: 'Spray prophylactic bio-fungicides in flower beds between 9:00 AM and 12:00 PM.',
                specialAlertBn: 'মাটির আর্দ্রতা ৫৭%, ফুল কাটার পর পরই ডিপ টিউবওয়েলের সেচ দিন।'
            },
            forecast5Day: [
                { dayBn: 'আজ', dayEn: 'Today', icon: 'fa-sun', maxTemp: 30, minTemp: 20, rainChance: '10%', adviceBn: 'গোলাপ ও জারবেরা ফুলে কুঁড়ি স্প্রে দিন।', adviceEn: 'Apply micronutrient spray to flower buds.' },
                { dayBn: 'আগামীকাল', dayEn: 'Tomorrow', icon: 'fa-sun', maxTemp: 31, minTemp: 21, rainChance: '10%', adviceBn: 'রজনীগন্ধার জমিতে পটাশ সার উপরিপ্রয়োগ।', adviceEn: 'Top-dress murate of potash in tuberose plots.' },
                { dayBn: 'বুধবার', dayEn: 'Wed', icon: 'fa-cloud-sun', maxTemp: 29, minTemp: 20, rainChance: '15%', adviceBn: 'রপ্তানিযোগ্য শসা ও ক্যাপসিকামের যত্ন নিন।', adviceEn: 'Train greenhouse cucumber & capsicum vine stems.' },
                { dayBn: 'বৃহস্পতিবার', dayEn: 'Thu', icon: 'fa-sun', maxTemp: 30, minTemp: 20, rainChance: '10%', adviceBn: 'ফুলের জমির আগাছা নির্মূল করুন।', adviceEn: 'Hand-pick weeds from flower nursery rows.' },
                { dayBn: 'শুক্রবার', dayEn: 'Fri', icon: 'fa-sun', maxTemp: 30, minTemp: 21, rainChance: '10%', adviceBn: 'ভোরবেলায় তাজা ফুল কেটে বাজারে পাঠান।', adviceEn: 'Harvest fresh cut-flowers at dawn for market.' }
            ]
        }
    };

    // =========================================================================
    // Post-Purchase Land Planning & Recommendation Advisor Dataset (জমি পরিকল্পনা)
    // =========================================================================
    const DEFAULT_LAND_ADVISOR_TEMPLATES = {
        models: [
            {
                key: 'fruits',
                nameEn: 'High-Value Commercial Fruit Orchard',
                nameBn: 'বাণিজ্যিক ফলদ বাগান (বারোমাসি আম, পেয়ারা, ড্রাগন ও মাল্টা)',
                icon: 'fa-apple-whole',
                color: 'emerald',
                badgeEn: 'Highest Long-Term ROI',
                badgeBn: 'সর্বাধিক দীর্ঘমেয়াদি মুনাফা (High ROI)',
                overviewEn: 'Transform parcels into multi-tier commercial orchards utilizing dwarf hybrid cultivars with high domestic and export market value.',
                overviewBn: 'উচ্চফলনশীল জাতের বারোমাসি কাটিমন আম, থাই পেয়ারা-৭, রেড ভেলভেট ড্রাগন ও বারি মাল্টা-১ চাষ করে প্রতি বছর নিশ্চিত উচ্চ মুনাফা অর্জন করুন।',
                suitabilityEn: 'High & medium-high land with no waterlogging risk, fertile sandy-loam soil, and 6+ hours daily sunlight.',
                suitabilityBn: 'উঁচু ও মাঝারি উঁচু জমি যেখানে বর্ষায় পানি জমে না, উর্বর বেলে-দোআঁশ মাটি এবং পর্যাপ্ত সূর্যালোক বিদ্যমান।',
                expectedYieldEn: 'BDT 1,50,000 - 2,50,000 per decimal annually after year 2.',
                expectedYieldBn: 'প্রতি বিঘায় বার্ষিক ১.৫ থেকে ২.৫ লাখ টাকা (ড্রাগন ও পেয়ারায় ১ম বছর থেকেই ফলন শুরু)।',
                budgetPerDecEn: 'Est. Setup: BDT 8,000 - 12,000 / decimal (Seedlings, drip lines & fencing)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ৮,০০০ - ১২,০০০ টাকা / শতাংশ (উন্নত চারা, ড্রিপ সেচ ও সুরক্ষা)',
                roiTimelineEn: 'Break-even in 18-24 months; profitable for 15+ years',
                roiTimelineBn: 'ব্রেক-ইভেন: ১৮ থেকে ২৪ মাস; একটানা ১৫+ বছর নিয়মিত লাভজনক',
                subsidyEn: 'Eligible for 4% concessional government agri-loan, 50% subsidy on solar drip irrigation, and free certified saplings from Upazila Agriculture Office.',
                subsidyBn: 'বাংলাদেশ ব্যাংকের ৪% রেয়াতি সুদের কৃষি ঋণ, সোলার ড্রিপ সেচে ৫০% সরকারি ভর্তুকি এবং উপজেলা কৃষি অফিস থেকে অনুমোদিত কলম চারা সহায়তা প্রযোজ্য।'
            },
            {
                key: 'crops',
                nameEn: 'High-Value Cash Crops & Protected Horticulture',
                nameBn: 'উচ্চমূল্যের অর্থকরী শস্য ও শেড-নেট পলিকালচার (ক্যাপসিকাম, ব্রকলি, স্ট্রবেরি ও ড্রাগন)',
                icon: 'fa-seedling',
                color: 'teal',
                badgeEn: 'Fastest Cash Flow',
                badgeBn: 'দ্রুততম ক্যাশ ফ্লো (৩-৪ মাসে আয়)',
                overviewEn: 'Year-round intensive cash-crop rotation inside agro-shade poly-tunnels yielding 4-5 harvest cycles per year.',
                overviewBn: 'শেড-নেট ও মালচিং প্রযুক্তিতে রঙিন ক্যাপসিকাম, ব্রকলি, স্কোয়াশ, মাশরুম ও ড্রপ-ফার্টিগেশন পদ্ধতিতে সবজি চাষ করে তাৎক্ষণিক ক্যাশ-ফ্লো নিশ্চিত করুন।',
                suitabilityEn: 'Loamy to clay-loam flat land with guaranteed access to fresh irrigation water and road connectivity.',
                suitabilityBn: 'সমতল উর্বর দোআঁশ জমি, নিশ্চিত মিষ্টি পানির সেচ উৎস এবং পাইকারি বাজারে দ্রুত পরিবহনের সংযোগ সড়ক।',
                expectedYieldEn: 'BDT 35,000 - 55,000 net profit per decimal per seasonal crop cycle.',
                expectedYieldBn: 'প্রতি শতাংশে প্রতি মৌসুমে ৩৫,০০০ থেকে ৫৫,০০০ টাকা নিট মুনাফা (বছরে ৩টি পূর্ণ চক্রে ১.৫ লাখ+ টাকা)।',
                budgetPerDecEn: 'Est. Setup: BDT 3,500 - 6,000 / decimal (Mulch sheet, trellis & seeds)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ৩,৫০০ - ৬,০০০ টাকা / শতাংশ (মালচিং শিট, মাচা, উন্নত বীজ ও ড্রিপ)',
                roiTimelineEn: 'First cash flow within 90 - 120 days from planting',
                roiTimelineBn: 'প্রথম ক্যাশ-ফ্লো: চারা রোপণের মাত্র ৯০ থেকে ১২০ দিনের মধ্যে',
                subsidyEn: 'Government seed incentive packs, up to 70% polyhouse construction subsidy via DAE Horticulture Wing, and concessional fertilizer rates.',
                subsidyBn: 'কৃষি সম্প্রসারণ অধিদপ্তর (DAE) থেকে বিনামূল্যে বীজ-সার প্রণোদনা, পলিনেট হাউজ নির্মাণে ৭০% পর্যন্ত সরকারি প্রকল্প সহায়তা।'
            },
            {
                key: 'fisheries',
                nameEn: 'High-Density Aquaculture & Double-Deck Fish Hatchery',
                nameBn: 'আধুনিক উচ্চঘনত্বের মিশ্র মৎস্য চাষ (তেলাপিয়া, পাঙ্গাশ, গুলশা, পাবদা ও কার্প)',
                icon: 'fa-fish-fins',
                color: 'blue',
                badgeEn: 'Consistent High Demand',
                badgeBn: 'বারোমাসি ব্যাপক চাহিদা ও তরল বাজার',
                overviewEn: 'Engineered pond excavation with bottom-drain or Biofloc technology for high-density, biosecure fish farming.',
                overviewBn: 'মাটি খনন করে উন্নত পাড়যুক্ত আধুনিক পুকুর বা বায়োফ্লক (Biofloc) ট্যাঙ্কে পাবদা, গুলশা, মনোসেক্স তেলাপিয়া ও কার্প জাতীয় মাছের বৈজ্ঞানিক চাষ।',
                suitabilityEn: 'Low to medium-low land retaining water naturally, impermeable clay-loam subsoil, and electric grid for aerators.',
                suitabilityBn: 'মাঝারি নিচু জমি যা স্বাভাবিকভাবে পানি ধরে রাখে, এঁটেল-দোআঁশ মাটি এবং এরিয়েটর চালানোর মতো বিদ্যুৎ সংযোগ।',
                expectedYieldEn: 'BDT 60,000 - 1,00,000 net margin per decimal per 6-month cycle.',
                expectedYieldBn: 'প্রতি শতাংশে ৬ মাসের কালচারে ৬০,০০০ থেকে ১,০০,০০০ টাকা (বছরে ২টি হার্ভেস্টে দ্বিগুণ মুনাফা)।',
                budgetPerDecEn: 'Est. Setup: BDT 7,000 - 12,000 / decimal (Excavation, netting, aerator & fingerlings)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ৭,০০০ - ১২,০০০ টাকা / শতাংশ (পুকুর খনন, পাড় বাঁধাই, এরিয়েটর ও পোনা)',
                roiTimelineEn: 'First harvest in 5 to 6 months',
                roiTimelineBn: 'প্রথম মাছ বিক্রি: পোনা ছাড়ার ৫ থেকে ৬ মাসের মধ্যে',
                subsidyEn: 'DoF certified disease-free fingerling subsidies, 4% fisheries refinancing scheme by Bangladesh Bank, and duty-free aerator import support.',
                subsidyBn: 'মৎস্য অধিদপ্তর (DoF) কর্তৃক গুণগত মানের পোনা সহায়তা, বাংলাদেশ ব্যাংকের ৪% রেয়াতি মৎস্য ঋণ এবং বিদ্যুৎ বিলে কৃষি রিবেট সুবিধা।'
            },
            {
                key: 'dairy',
                nameEn: 'Integrated Modern Dairy, Cattle & Goat Farm',
                nameBn: 'সমন্বিত আধুনিক ডেইরি, গাভী পালন ও ছাগল-ভেড়ার খামার',
                icon: 'fa-cow',
                color: 'amber',
                badgeEn: 'Daily Cash Flow & Milk Yield',
                badgeBn: 'প্রতিদিনের নগদ দুধ ও বায়োগ্যাস আয়',
                overviewEn: 'Eco-friendly dairy shade shed with silage storage, bio-gas digester, and high-yield Napier/Pakchong grass cultivation.',
                overviewBn: 'উন্নত ফ্রিজিয়ান/শাহিওয়াল গাভী, আধুনিক স্টিল শেড, মিল্কিং মেশিন, সাইলেজ সংরক্ষণ এবং বর্জ্য থেকে বিদ্যুৎ ও বায়োগ্যাস উৎপাদনের টেকসই মডেল।',
                suitabilityEn: 'Flood-free elevated land with reliable road access for daily milk transport and dry fodder acreage.',
                suitabilityBn: 'বন্যা ঝুঁকিমুক্ত উঁচু ভিটা জমি, দুধ বাজারজাতকরণের জন্য পাকা সড়ক এবং নেপিয়ার ঘাস চাষের উপযুক্ত পাশ্ববর্তী জমি।',
                expectedYieldEn: 'BDT 80,000 - 1,50,000 net annual profit per milking cow; solid capital appreciation.',
                expectedYieldBn: 'প্রতিটি দুগ্ধবতী গাভী থেকে বার্ষিক ৮০,০০০ - ১,৫০,০০০ টাকা নিট লাভ এবং প্রতি বছর বাছুরের মাধ্যমে মূলধন বৃদ্ধি।',
                budgetPerDecEn: 'Est. Setup: BDT 15,000 - 25,000 / decimal (Semi-pucca shed, fodder plot & bio-gas)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ১৫,০০০ - ২৫,০০০ টাকা / শতাংশ (সেমি-পাকা আধুনিক শেড, ঘাসের বেড ও পানির লাইন)',
                roiTimelineEn: 'Daily revenue commences on day 1 with milking cattle; break-even in 24 months',
                roiTimelineBn: 'প্রথম দিন থেকেই দুধ বিক্রির নগদ আয় শুরু; মূলধনী বিনিয়োগ ফেরত ২৪ মাসের মধ্যে',
                subsidyEn: 'DLS veterinary immunization support, subsidized AI (Artificial Insemination), IDCOL bio-gas plant grants, and low-interest livestock loans.',
                subsidyBn: 'প্রাণিসম্পদ অধিদপ্তর (DLS) থেকে বিনামূল্যে টিকা ও উন্নত কৃত্রিম প্রজনন (AI) সেবা, ইডকল (IDCOL) বায়োগ্যাস অনুদান।'
            },
            {
                key: 'warehouse',
                nameEn: 'Agro Cold Storage, Processing & Logistics Warehouse',
                nameBn: 'কৃষি প্রক্রিয়াকরণ কোল্ড-স্টোরেজ ও অ্যাগ্রো-লজিস্টিকস ওয়্যারহাউস',
                icon: 'fa-warehouse',
                color: 'indigo',
                badgeEn: 'Stable Commercial Rental',
                badgeBn: 'মাসিক স্থায়ী ভাড়া ও বাণিজ্যিক স্থায়িত্ব',
                overviewEn: 'Prefabricated insulated steel warehouse or mini cold-storage for post-harvest potato, fruits, onions, and crop preservation.',
                overviewBn: 'হাইওয়ে বা বাজার সংলগ্ন জমিতে প্রি-ফ্যাব্রিকেটেড স্টিল শেড ওয়্যারহাউস অথবা মিনি কোল্ড স্টোরেজ তৈরি করে স্থানীয় ফল-ফসলের ভাড়াভিত্তিক সংরক্ষণ।',
                suitabilityEn: 'Direct highway frontage (minimum 20ft road width), high dry land, heavy truck turning radius, and three-phase electricity.',
                suitabilityBn: 'প্রধান সড়ক বা হাইওয়ের পাশে (ন্যূনতম ২০ ফুট রাস্তা), শতভাগ বন্যাযুক্ত উঁচু জমি এবং থ্রি-ফেজ শিল্প বিদ্যুৎ সংযোগ।',
                expectedYieldEn: 'Rental income BDT 25 - 45 / sq.ft monthly plus cold room storage margins.',
                expectedYieldBn: 'প্রতি বর্গফুটে মাসিক ২৫ থেকে ৪৫ টাকা স্থায়ী ভাড়া অথবা নিজস্ব স্টোরেজ পরিচালনায় বার্ষিক ৩০-৪০% মূলধনী লাভ।',
                budgetPerDecEn: 'Est. Setup: BDT 45,000 - 75,000 / decimal (Heavy RCC footing & insulated steel structure)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ৪৫,০০০ - ৭৫,০০০ টাকা / শতাংশ (আরসিসি ফ্লোরিং, স্টিল শেড ও নিরোধক আবরণ)',
                roiTimelineEn: 'Continuous rental income starting month 6; full payback in 4-5 years',
                roiTimelineBn: 'নির্মাণের ৬ষ্ঠ মাস থেকে নিয়মিত মাসিক ভাড়া; ৪ থেকে ৫ বছরে সম্পূর্ণ মূলধন পুনরুদ্ধার',
                subsidyEn: 'Agro-processing infrastructure tax holidays, SME Foundation low-interest term financing, and import duty exemption on refrigeration compressors.',
                subsidyBn: 'কৃষিভিত্তিক শিল্পে সরকারের ৫ বছরের আয়কর রেয়াত (Tax Holiday), এসএমই ফাউন্ডেশন ও বাংলাদেশ ব্যাংকের কম সুদে মেয়াদী ঋণ।'
            },
            {
                key: 'farmhouse',
                nameEn: 'Agri-Tourism Eco-Resort & Private Farmhouse',
                nameBn: 'পরিবেশবান্ধব এগ্রো-রিসোর্ট ও পারিবারিক ইকো-ফার্মহাউস',
                icon: 'fa-tree',
                color: 'purple',
                badgeEn: 'Premium Lifestyle & Tourism',
                badgeBn: 'লাইফস্টাইল ভ্যালু ও রিসোর্ট ইনকাম',
                overviewEn: 'Boutique farm retreat combining wooden cottages, organic fish pond, fruit orchards, and weekend agro-tourism rentals.',
                overviewBn: 'সবুজ প্রকৃতির মাঝে প্রিমিয়াম কাঠের বা বাঁশের কটেজ, দৃষ্টিনন্দন মৎস্য পুকুর, ফলদ বাগান ও ফুলশোভিত লন তৈরি করে নিজস্ব বিশ্রামাগার বা রিসোর্ট ব্যবসা।',
                suitabilityEn: 'Scenic rural or riverside setting within 1-2 hours driving distance from major metropolis (Dhaka, Chittagong, etc.).',
                suitabilityBn: 'ঢাকা বা প্রধান শহর থেকে ১-২ ঘণ্টার দূরত্বে মনোরম গ্রামীণ বা নদী তীরবর্তী প্রাকৃতিক পরিবেশ ও নিরাপত্তা ব্যবস্থা।',
                expectedYieldEn: 'BDT 5,000 - 15,000 per night weekend cottage rental plus 25% annual parcel capital appreciation.',
                expectedYieldBn: 'উইকেন্ডে কটেজ ভাড়ায় প্রতি রাতে ৫,০০০ - ১৫,০০০ টাকা আয় এবং জমির দাম বার্ষিক ২০-২৫% হারে প্রবৃদ্ধি।',
                budgetPerDecEn: 'Est. Setup: BDT 30,000 - 50,000 / decimal (Landscaping, pond decking & eco-cottage)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ৩০,০০০ - ৫০,০০০ টাকা / শতাংশ (ল্যান্ডস্কেপিং, কটেজ নির্মাণ, বাগান ও লাইটিং)',
                roiTimelineEn: 'Weekend operational revenue starting month 4',
                roiTimelineBn: 'নির্মাণ শুরুর মাত্র ৪ মাসের মধ্যেই উইকেন্ড বুকিং ও আয় শুরু',
                subsidyEn: 'Eco-tourism green financing support, sustainable agro-forestry sapling grants, and solar infrastructure subsidies.',
                subsidyBn: 'গ্রিন ব্যাংকিং অর্থায়ন সুবিধা, বন বিভাগ থেকে শোভাবর্ধনকারী দুর্লভ বৃক্ষ চারা এবং সোলার হোম সিস্টেমে সরকারি ভর্তুকি।'
            },
            {
                key: 'boundary',
                nameEn: 'RCC Boundary Wall, Security Pillars & Timber Forestry',
                nameBn: 'স্থায়ী আরসিসি সীমানা প্রাচীর, পিলার ও কাঠের বাগান (জমি দখল সুরক্ষা)',
                icon: 'fa-shield-halved',
                color: 'rose',
                badgeEn: 'Zero Dispute Land Protection',
                badgeBn: 'জমির নিরাপত্তা ও শতভাগ দখল নিশ্চিতকরণ',
                overviewEn: 'Immediate post-purchase legal protection via engineered RCC boundary pillars, barbed wire, signboards, and high-value timber trees (Mahogany/Agar/Teak).',
                overviewBn: 'জমি কেনার পরপরই আইনি জটিলতা ও বেদখল চিরতরে বন্ধ করতে ৪ পাশে আরসিসি সীমানা পিলার, কাঁটাতারের বেড়া, মালিকানার সাইনবোর্ড ও মেহগনি/আগর বাগান।',
                suitabilityEn: 'Mandatory for 100% of newly purchased lands across all districts and mouzas.',
                suitabilityBn: 'বাংলাদেশের যে কোনো মৌজায় নতুন কেনা সকল ধরণের আবাসিক, বাণিজ্যিক বা কৃষিজমির জন্য প্রথম ও বাধ্যতামূলক পদক্ষেপ।',
                expectedYieldEn: 'Eliminates legal litigation costs; boundary timber trees yield BDT 15,00,000+ upon maturity in 10-12 years.',
                expectedYieldBn: 'মামলা ও দখলের কোটি টাকার ঝুঁকি শূন্য করে; ১০-১২ বছর পর সীমানার মেহগনি/সেগুন গাছ থেকে বিঘাপ্রতি ১৫ লাখ+ টাকা আয়।',
                budgetPerDecEn: 'Est. Setup: BDT 2,500 - 4,500 / decimal (Demarcation, RCC pillars, barbed wire & saplings)',
                budgetPerDecBn: 'আনুমানিক প্রাথমিক খরচ: ২,৫০০ - ৪,৫০০ টাকা / শতাংশ (আমিন জরিপ, আরসিসি পিলার, কাঁটাতারের বেড়া ও গাছ)',
                roiTimelineEn: 'Instant safety on day 1; massive capital gain',
                roiTimelineBn: '১ম দিন থেকেই শতভাগ ঝুঁকিহীন দখল; ভবিষ্যতে জমি বিক্রির সময় ৩০% বেশি বাজারদর নিশ্চিত',
                subsidyEn: 'Certified government surveyor demarcation through Upazila Land Office under official fee structure.',
                subsidyBn: 'উপজেলা সহকারী কমিশনার (ভূমি) অফিস থেকে সরকারি নির্দিষ্ট ফিতে অনুমোদিত সার্ভেয়ার দ্বারা সীমানা মাপ ও রিপোর্ট প্রাপ্তির সুবিধা।'
            }
        ],

        legalRoadmap: [
            {
                step: 1,
                titleBn: 'ই-নামজারি (e-Mutation) ও জমা-খারিজ আবেদন',
                titleEn: 'e-Mutation & Khatian Separation',
                dayRange: '১ - ১৫ দিন',
                detailsBn: 'জমি কেনার পর মূল দলিল বা সার্টিফাইড কপি দিয়ে অনলাইনে mutation.land.gov.bd পোর্টালে ই-নামজারির আবেদন করুন। নামজারি ছাড়া জমির সরকারি মালিকানা ও রেকর্ড হালনাগাদ হয় না।',
                detailsEn: 'File digital e-Mutation application with certified deed on mutation.land.gov.bd. Essential to update official government revenue ownership.',
                officeBn: 'সহকারী কমিশনার (ভূমি) অফিস / www.mutation.land.gov.bd',
                officeEn: 'Assistant Commissioner (Land) Office & land.gov.bd'
            },
            {
                step: 2,
                titleBn: 'ইউনিয়ন/পৌর ভূমি সহকারী কর্মকর্তার সরেজমিন তদন্ত',
                titleEn: 'Field Inspection by Union Land Officer (Tahsil)',
                dayRange: '১৬ - ২৫ দিন',
                detailsBn: 'তহশিলদার আপনার জমি সরেজমিনে পরিদর্শন করে প্রকৃত দখল, সিএস/এসএ/আরএস রেকর্ডের মিল এবং কোনো অর্পিত বা খাসজমি সংক্রান্ত বিরোধ নেই তা প্রতিবেদন আকারে এসি ল্যান্ড অফিসে পাঠাবেন।',
                detailsEn: 'Union Tahsildar conducts on-site field verification to verify physical possession and boundaries without disputes.',
                officeBn: 'ইউনিয়ন বা পৌর ভূমি অফিস (তহশিল অফিস)',
                officeEn: 'Union/Pourashava Land Office (Tahsil Office)'
            },
            {
                step: 3,
                titleBn: 'শুনানি ও সহকারী কমিশনার (ভূমি) এর চূড়ান্ত অনুমোদন',
                titleEn: 'Hearing & AC Land Final Order',
                dayRange: '২৬ - ৩৫ দিন',
                detailsBn: 'শুনানির তারিখে মূল দলিল, পূর্ববর্তী খতিয়ান ও ওয়ারিশান (প্রযোজ্য ক্ষেত্রে) সহ হাজির হোন। কোনো আপত্তি না থাকলে এসি ল্যান্ড নামজারি প্রস্তাব অনুমোদন করবেন।',
                detailsEn: 'Attend formal hearing before AC Land with original deed and previous khatian chain for judicial approval.',
                officeBn: 'উপজেলা সহকারী কমিশনার (ভূমি) এর আদালত',
                officeEn: 'Court of Assistant Commissioner (Land)'
            },
            {
                step: 4,
                titleBn: 'ডিসিআর (DCR) ফি পরিশোধ ও ডিজিটাল নামজারি খতিয়ান প্রিন্ট',
                titleEn: 'DCR Payment & Certified Digital Khatian',
                dayRange: '৩৬ - ৪০ দিন',
                detailsBn: 'সরকারি নির্দিষ্ট ১,১০০ টাকা ডিসিআর ফি অনলাইনে (বিকাশ/নগদ/কার্ড) পরিশোধ করুন এবং কিউআর কোডযুক্ত ডিজিটাল নামজারি খতিয়ান ও ডিসিআর কপি ডাউনলোড করে প্রিন্ট করুন।',
                detailsEn: 'Pay official BDT 1,100 DCR fee online via Nagad/bKash to download the QR-verified digital Mutation Khatian.',
                officeBn: 'অনলাইন ভূমি সেবা পোর্টাল (ldtax.gov.bd / mutation.land.gov.bd)',
                officeEn: 'Land Service Portal (land.gov.bd)'
            },
            {
                step: 5,
                titleBn: 'অনলাইন ভূমি উন্নয়ন কর (খাজনা) দাখিলা গ্রহণ',
                titleEn: 'Online Land Development Tax (Khajna Dakhila)',
                dayRange: '৪১ - ৪৫ দিন',
                detailsBn: 'নতুন খতিয়ান নম্বর দিয়ে ldtax.gov.bd পোর্টালে আপনার হোল্ডিং এন্ট্রি করুন এবং চলতি ১৪৩২-১৪৩৩ বঙ্গাব্দের ভূমি উন্নয়ন কর পরিশোধ করে ডিজিটাল কিউআর কোড দাখিলা সংগ্রহ করুন।',
                detailsEn: 'Register new holding on ldtax.gov.bd and clear current fiscal year land tax to receive instant QR tax receipts.',
                officeBn: 'ইউনিয়ন ভূমি অফিস ও ldtax.gov.bd',
                officeEn: 'Union Land Office & ldtax.gov.bd'
            },
            {
                step: 6,
                titleBn: 'সরকারি সার্ভেয়ার দ্বারা আরসিসি সীমানা পিলার স্থাপন',
                titleEn: 'Cadastral Survey Demarcation & RCC Boundary Pillars',
                dayRange: '৪৬ - ৫০ দিন',
                detailsBn: 'সরকারি তালিকাভুক্ত অভিজ্ঞ আমিন/সার্ভেয়ার ও মৌজা নকশা (Sheet) নিয়ে চারপাশের সীমানা নির্ভুলভাবে মেপে আরসিসি পিলার ও কাঁটাতারের বেষ্টনী দিয়ে দখল স্থায়ী করুন।',
                detailsEn: 'Engage government certified surveyor with official Mouza sheet to plant permanent RCC boundary pillars.',
                officeBn: 'উপজেলা ভূমি অফিস / পেশাদার সনদপ্রাপ্ত সার্ভেয়ার',
                officeEn: 'Upazila Land Office / Certified Cadastral Surveyors'
            },
            {
                step: 7,
                titleBn: 'মাটি পরীক্ষা (Soil Test) ও কৃষি প্রকল্পের কাজ শুরু',
                titleEn: 'SRDI Soil Profiling & Project Execution Kickoff',
                dayRange: '৫০ দিনের পর',
                detailsBn: 'মাটির ৫টি স্থান থেকে নমুনা সংগ্রহ করে উপজেলা কৃষি অফিস অথবা মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউটে (SRDI) মাটি পরীক্ষা (pH, জৈব পদার্থ ও পুষ্টি) করিয়ে নির্বাচিত মডেল বাস্তবায়নে নামুন।',
                detailsEn: 'Submit composite soil samples to Upazila Agriculture Office / SRDI for pH/NPK fertility profiling and initiate project phase.',
                officeBn: 'উপজেলা কৃষি অফিস / মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট (SRDI)',
                officeEn: 'Upazila Agriculture Office & SRDI Laboratory'
            }
        ]
    };


    // Local Storage Keys
    const KEYS = {
        CONFIG: 'smartland_site_config_v3',
        USERS: 'smartland_users_v3',
        PLOTS: 'smartland_plots_v3',
        SLIDES: 'smartland_slides_v3',
        POLICE: 'smartland_police_v3',
        GALLERY: 'smartland_gallery_v3',
        OFFICIALS: 'smartland_officials_v3',
        WEATHER: 'smartland_weather_v3',
        ADVISOR: 'smartland_advisor_v3',
        MAP_CONFIG: 'smartland_map_config_v3',
        USER_SESSION: 'smartland_current_user_v3',
        USER_LOCKOUT: 'smartland_user_lockout_v3',
        ADMIN_SESSION: 'smartland_admin_session_v3',
        ADMIN_SECURITY: 'smartland_admin_security_v3',
        ADMIN_LOCKOUT: 'smartland_admin_lockout_v3',
        ACTIVITY_LOGS: 'smartland_activity_logs_v3',
        LANG: 'smartland_language_v3'
    };

    // Dictionary for UI Translations
    const TRANSLATIONS = {
        en: {
            adminPortal: 'Admin Panel',
            adminLink: 'Admin Link',
            loginTitle: 'Landowner Sign In',
            loginSub: 'Enter your credentials to access cadastral plots',
            username: 'Username',
            password: 'Password',
            enterPortal: 'Enter Smart Land Mapping',
            presetUsers: '10 Pre-configured Accounts',
            clickToLogin: 'Click any user below for instant 1-click login:',
            dashboard: 'Dashboard Summary',
            myPlots: 'My Land Plots',
            verifications: 'Clearances & Police',
            directory: '10 Users Directory',
            registerPlot: 'Register Land Plot',
            signOut: 'Sign Out',
            totalPlots: 'Surveyed Plots',
            totalArea: 'Total Land Area',
            fullyVerified: 'Fully Verified',
            activeCrops: 'Active Crops',
            landNumber: 'DAG / Land #',
            mouza: 'Mouza & Location',
            area: 'Area / Decimals',
            currentCrop: 'Current Crop',
            policeStatus: 'Police Clearance',
            imageStatus: 'Satellite Photo',
            cropStatus: 'Agri Crop Status',
            actions: 'Actions',
            gisMap: 'GIS Map',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            searchPlaceholder: 'Search DAG, Mouza, Crop, Owner...',
            hotline: 'Hotline',
            switchUser: 'Switch User',
            activeSession: 'Active Session',
            langLabel: 'Language',
            langToggle: 'বাংলা',
            inspectCoords: 'Inspect Coordinates',
            systemOnline: 'SYSTEM STATUS: ONLINE',
            liveMap: 'GIS Live Land Map',
            emergencyPolice: 'Emergency Police Service',
            allPoliceStations: 'All District Police Stations',
            callNow: 'Call Station Now',
            dutyOfficer: 'Duty Officer',
            ocContact: 'OC Mobile',
            spOffice: 'SP Office',
            searchPolice: 'Search Police Station, District, Thana or Phone...',
            allDivisions: 'All Divisions',
            photoGallery: 'Cadastral Photo Gallery',
            viewOnMap: 'View on Map',
            menuHome: 'Overview',
            menuMap: 'Live Map',
            menuPlots: 'All Plots',
            menuEmergency: 'Emergency Police',
            menuGallery: 'Photo Gallery',
            menuLandowners: 'Landowners',
            menuGuidelines: 'Guidelines & Tools',
            calculator: 'Land Measurement Calculator',
            editCredentials: 'Edit Username & Password',
            menuAdvisor: 'Land Advisor',
            menuWeather: 'Agro-Weather',
            menuOfficials: 'Land & Agri Officers',
            postPurchaseTitle: 'Post-Purchase Land Planning & Recommendations',
            weatherCenter: 'Agricultural Climate & Weather Center',
            districtOfficials: 'District Land & Agriculture Directory'
        },
        bn: {
            adminPortal: 'অ্যাডমিন প্যানেল',
            adminLink: 'অ্যাডমিন লিংক',
            loginTitle: 'ভূমির মালিক লগইন',
            loginSub: 'ক্যাডাস্ট্রাল প্লট ও রেকর্ড দেখতে তথ্য দিন',
            username: 'ইউজারনেম',
            password: 'পাসওয়ার্ড',
            enterPortal: 'স্মার্ট ল্যান্ড ম্যাপিং এ প্রবেশ করুন',
            presetUsers: '১০টি প্রস্তুতকৃত একাউন্ট',
            clickToLogin: 'নিচের যেকোনো একাউন্টে ক্লিক করে সরাসরি লগইন করুন:',
            dashboard: 'ড্যাশবোর্ড সারসংক্ষেপ',
            myPlots: 'আমার জমির প্লটসমূহ',
            verifications: 'পুলিশ ও ছাড়পত্র',
            directory: '১০ ইউজার ডিরেক্টরি',
            registerPlot: 'নতুন প্লট নিবন্ধন',
            signOut: 'লগআউট',
            totalPlots: 'মোট জরিপকৃত প্লট',
            totalArea: 'মোট জমির পরিমাণ',
            fullyVerified: 'শতভাগ যাচাইকৃত',
            activeCrops: 'সক্রিয় ফসল',
            landNumber: 'দাগ / খতিয়ান নম্বর',
            mouza: 'মৌজা ও অবস্থান',
            area: 'জমির আয়তন (শতাংশ)',
            currentCrop: 'বর্তমান চাষকৃত ফসল',
            policeStatus: 'পুলিশ ক্লিয়ারেন্স',
            imageStatus: 'স্যাটেলাইট ছবি',
            cropStatus: 'কৃষি কর্মকর্তার প্রত্যয়ন',
            actions: 'কার্যক্রম',
            gisMap: 'জিআইএস ম্যাপ',
            edit: 'এডিট',
            delete: 'মুছুন',
            save: 'সংরক্ষণ',
            cancel: 'বাতিল',
            searchPlaceholder: 'দাগ নম্বর, মৌজা, ফসল বা মালিকের নাম খুঁজুন...',
            hotline: 'হটলাইন',
            switchUser: 'একাউন্টে যান',
            activeSession: 'সক্রিয় সেশন',
            langLabel: 'ভাষা',
            langToggle: 'ENG',
            inspectCoords: 'স্থানাঙ্ক দেখুন',
            systemOnline: 'সিস্টেম স্ট্যাটাস: অনলাইন',
            liveMap: 'লাইভ ভূমি ম্যাপ',
            emergencyPolice: 'জরুরি পুলিশ সেবা',
            allPoliceStations: 'সকল জেলা ও থানার পুলিশ স্টেশন',
            callNow: 'এখনই কল করুন',
            dutyOfficer: 'ডিউটি অফিসার',
            ocContact: 'ওসি মোবাইল',
            spOffice: 'পুলিশ সুপার (এসপি)',
            searchPolice: 'থানা, জেলা বা ফোন নম্বর দিয়ে পুলিশ খুঁজুন...',
            allDivisions: 'সকল বিভাগ',
            photoGallery: 'জমি ও জরিপ চিত্রশালা',
            viewOnMap: 'ম্যাপে দেখুন',
            menuHome: 'ওভারভিউ',
            menuMap: 'লাইভ ম্যাপ',
            menuPlots: 'জমির তালিকা',
            menuEmergency: 'জরুরি পুলিশ',
            menuGallery: 'চিত্রশালা',
            menuLandowners: 'মালিকবৃন্দ',
            menuGuidelines: 'নির্দেশিকা ও টুলস',
            calculator: 'ভূমি পরিমাপ ক্যালকুলেটর',
            editCredentials: 'ইউজারনেম ও পাসওয়ার্ড পরিবর্তন',
            menuAdvisor: 'জমি পরিকল্পনা',
            menuWeather: 'আবহাওয়া বার্তা',
            menuOfficials: 'কৃষি ও ভূমি কর্মকর্তা',
            postPurchaseTitle: 'জমি কেনার পর কি কি করবেন ও পরিপূর্ণ পরিকল্পনা',
            weatherCenter: 'কৃষি আবহাওয়া ও জলবায়ু কেন্দ্র',
            districtOfficials: 'জেলার কৃষি এবং ভূমি সংক্রান্ত কর্মকর্তাদের তালিকা'
        }
    };

    const GeoTerraStore = {
        init: function () {
            if (!localStorage.getItem(KEYS.CONFIG)) {
                localStorage.setItem(KEYS.CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
            }
            if (!localStorage.getItem(KEYS.USERS)) {
                localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
            }
            if (!localStorage.getItem(KEYS.PLOTS)) {
                localStorage.setItem(KEYS.PLOTS, JSON.stringify(DEFAULT_PLOTS));
            } else {
                try {
                    const existing = JSON.parse(localStorage.getItem(KEYS.PLOTS));
                    if (Array.isArray(existing) && existing.length < DEFAULT_PLOTS.length) {
                        const existingIds = new Set(existing.map(p => p.id));
                        const missing = DEFAULT_PLOTS.filter(p => !existingIds.has(p.id));
                        if (missing.length > 0) {
                            const combined = existing.concat(missing);
                            localStorage.setItem(KEYS.PLOTS, JSON.stringify(combined));
                        }
                    }
                } catch (e) {}
            }
            if (!localStorage.getItem(KEYS.SLIDES)) {
                localStorage.setItem(KEYS.SLIDES, JSON.stringify(DEFAULT_SLIDES));
            }
            if (!localStorage.getItem(KEYS.POLICE)) {
                localStorage.setItem(KEYS.POLICE, JSON.stringify(DEFAULT_POLICE_STATIONS));
            }
            if (!localStorage.getItem(KEYS.GALLERY)) {
                localStorage.setItem(KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY_PHOTOS));
            }
            if (!localStorage.getItem(KEYS.OFFICIALS)) {
                localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(DEFAULT_LAND_OFFICIALS));
            }
            if (!localStorage.getItem(KEYS.WEATHER)) {
                localStorage.setItem(KEYS.WEATHER, JSON.stringify(DEFAULT_DISTRICT_WEATHER));
            }
            if (!localStorage.getItem(KEYS.ADVISOR)) {
                localStorage.setItem(KEYS.ADVISOR, JSON.stringify(DEFAULT_LAND_ADVISOR_TEMPLATES));
            }
            if (!localStorage.getItem(KEYS.MAP_CONFIG)) {
                localStorage.setItem(KEYS.MAP_CONFIG, JSON.stringify({
                    defaultCenter: [23.8103, 90.4125],
                    defaultZoom: 11,
                    tileLayer: 'satellite',
                    defaultDistrict: 'Dhaka',
                    autoFitBounds: true
                }));
            }
            if (!localStorage.getItem(KEYS.LANG)) {
                localStorage.setItem(KEYS.LANG, 'bn'); // Default to Bangla as requested
            }
            if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) {
                const initialLogs = [
                    { id: 'log-1', timestamp: new Date().toISOString(), action: 'System Initialized', details: 'Smart Land Mapping System deployed with full Bangla & English CMS and administrative controls.', user: 'System' }
                ];
                localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(initialLogs));
            }

            // Cross-tab sync
            window.addEventListener('storage', (e) => {
                if (Object.values(KEYS).includes(e.key)) {
                    window.dispatchEvent(new CustomEvent('geoterra-data-synced', { detail: { key: e.key } }));
                }
            });
        },

        _notifyChange: function (changedKey) {
            window.dispatchEvent(new CustomEvent('geoterra-data-synced', { detail: { key: changedKey } }));
        },

        // --- Language Switcher (Bangla / English) ---
        getLanguage: function () {
            return localStorage.getItem(KEYS.LANG) || 'bn';
        },

        setLanguage: function (lang) {
            const chosen = (lang === 'en' || lang === 'bn') ? lang : 'bn';
            localStorage.setItem(KEYS.LANG, chosen);
            this._notifyChange(KEYS.LANG);
            return chosen;
        },

        toggleLanguage: function () {
            const current = this.getLanguage();
            const next = current === 'bn' ? 'en' : 'bn';
            return this.setLanguage(next);
        },

        t: function (key) {
            const lang = this.getLanguage();
            return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['en'][key] || key;
        },

        // --- Slides / Carousel Data (Home Section) ---
        getSlides: function () {
            try {
                const s = localStorage.getItem(KEYS.SLIDES);
                return s ? JSON.parse(s) : DEFAULT_SLIDES;
            } catch (e) {
                return DEFAULT_SLIDES;
            }
        },

        saveSlide: function (slideData) {
            try {
                let slides = this.getSlides();
                if (!slideData.id) {
                    slideData.id = 'slide-' + Date.now();
                }
                const idx = slides.findIndex(s => s.id === slideData.id);
                if (idx !== -1) {
                    slides[idx] = Object.assign({}, slides[idx], slideData);
                } else {
                    slides.push(slideData);
                }
                localStorage.setItem(KEYS.SLIDES, JSON.stringify(slides));
                this.addActivityLog('Slide Saved', `Carousel slide "${slideData.titleBn || slideData.titleEn}" updated.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.SLIDES);
                return { success: true, slide: slideData };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteSlide: function (slideId) {
            try {
                let slides = this.getSlides();
                slides = slides.filter(s => s.id !== slideId);
                localStorage.setItem(KEYS.SLIDES, JSON.stringify(slides));
                this.addActivityLog('Slide Removed', `Slide ID ${slideId} deleted.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.SLIDES);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        // --- Site Configuration (CMS / Website Full Control) ---
        getSiteConfig: function () {
            try {
                const cfg = localStorage.getItem(KEYS.CONFIG);
                if (!cfg) return DEFAULT_SITE_CONFIG;
                const parsed = JSON.parse(cfg);
                if (parsed.siteName && parsed.siteName.includes('GeoTerra')) {
                    parsed.siteName = DEFAULT_SITE_CONFIG.siteName;
                }
                if (parsed.siteNameBn && (parsed.siteNameBn.includes('জিওটেরা') || parsed.siteNameBn.includes('GeoTerra'))) {
                    parsed.siteNameBn = DEFAULT_SITE_CONFIG.siteNameBn;
                }
                if (parsed.heroTitle && parsed.heroTitle.includes('GeoTerra')) {
                    parsed.heroTitle = DEFAULT_SITE_CONFIG.heroTitle;
                }
                if (parsed.heroTitleBn && (parsed.heroTitleBn.includes('জিওটেরা') || parsed.heroTitleBn.includes('GeoTerra'))) {
                    parsed.heroTitleBn = DEFAULT_SITE_CONFIG.heroTitleBn;
                }
                return parsed;
            } catch (e) {
                return DEFAULT_SITE_CONFIG;
            }
        },

        updateSiteConfig: function (newConfig) {
            const current = this.getSiteConfig();
            const merged = Object.assign({}, current, newConfig);
            localStorage.setItem(KEYS.CONFIG, JSON.stringify(merged));
            this.addActivityLog('CMS Updated', 'Website branding, notices and header settings modified by Administrator.', 'Admin sowrovshiekjh');
            this._notifyChange(KEYS.CONFIG);
            return merged;
        },

        // --- User Management ---
        getAllUsers: function () {
            try {
                const u = localStorage.getItem(KEYS.USERS);
                return u ? JSON.parse(u) : DEFAULT_USERS;
            } catch (e) {
                return DEFAULT_USERS;
            }
        },

        getUser: function (username) {
            const users = this.getAllUsers();
            return users.find(u => u.username.toLowerCase() === username.toLowerCase());
        },

        updateUser: function (originalUsername, updatedUserData) {
            const users = this.getAllUsers();
            const origClean = (originalUsername || '').trim().toLowerCase();
            const newClean = (updatedUserData.username || '').trim().toLowerCase();

            if (!newClean) {
                return { success: false, error: 'Username cannot be blank!' };
            }
            if (!updatedUserData.password) {
                return { success: false, error: 'Password cannot be blank!' };
            }

            // Check if username was modified and if new username conflicts with another existing user
            if (origClean && newClean && origClean !== newClean) {
                const existing = users.find(u => u.username.toLowerCase() === newClean);
                if (existing) {
                    return { success: false, error: `Username "${updatedUserData.username}" is already in use by another landowner!` };
                }
            }

            const index = users.findIndex(u => u.username.toLowerCase() === origClean);

            if (index >= 0) {
                const oldUser = users[index];
                const mergedUser = Object.assign({}, oldUser, updatedUserData);
                mergedUser.username = newClean;
                mergedUser.password = String(updatedUserData.password).trim();
                users[index] = mergedUser;

                // Reassign all associated land plots if username changed
                if (origClean !== newClean) {
                    let plots = this.getAllLands();
                    let plotsUpdatedCount = 0;
                    plots = plots.map(p => {
                        if (p.ownerUsername && p.ownerUsername.toLowerCase() === origClean) {
                            plotsUpdatedCount++;
                            return Object.assign({}, p, {
                                ownerUsername: mergedUser.username,
                                ownerName: mergedUser.fullName,
                                ownerNameBn: mergedUser.fullNameBn || mergedUser.fullName,
                                district: p.district || mergedUser.district
                            });
                        }
                        return p;
                    });
                    localStorage.setItem(KEYS.PLOTS, JSON.stringify(plots));
                    this._notifyChange(KEYS.PLOTS);

                    // Update live user session if the currently logged in user was modified
                    const currentSession = this.getUserSession();
                    if (currentSession && currentSession.username.toLowerCase() === origClean) {
                        const updatedSession = Object.assign({}, currentSession, mergedUser);
                        this.setUserSession(updatedSession);
                    }
                } else {
                    // Even if username stayed the same, update session if this user is active
                    const currentSession = this.getUserSession();
                    if (currentSession && currentSession.username.toLowerCase() === origClean) {
                        const updatedSession = Object.assign({}, currentSession, mergedUser);
                        this.setUserSession(updatedSession);
                    }
                }

                localStorage.setItem(KEYS.USERS, JSON.stringify(users));
                this.addActivityLog(
                    'User Credentials Updated',
                    `Admin modified account for "${mergedUser.fullName}". Username: "${origClean}" ➔ "${mergedUser.username}". Password updated.`,
                    'Admin sowrovshiekjh'
                );
                this._notifyChange(KEYS.USERS);
                return { success: true, user: mergedUser };
            } else {
                // New User Registration
                const existing = users.find(u => u.username.toLowerCase() === newClean);
                if (existing) {
                    return { success: false, error: `Username "${updatedUserData.username}" is already taken!` };
                }
                const newUser = Object.assign({ status: 'Active' }, updatedUserData);
                newUser.username = newClean;
                newUser.password = String(updatedUserData.password).trim();
                users.push(newUser);
                localStorage.setItem(KEYS.USERS, JSON.stringify(users));
                this.addActivityLog('New User Created', `Admin registered user "${newUser.fullName}" (${newUser.username}).`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.USERS);
                return { success: true, user: newUser };
            }
        },

        saveUser: function (userData) {
            const orig = userData.oldUsername || userData.username;
            return this.updateUser(orig, userData);
        },

        // --- All-Districts Emergency Police Station Service (Police Section) ---
        getPoliceStations: function (filters = {}) {
            let list = [];
            try {
                const raw = localStorage.getItem(KEYS.POLICE);
                list = raw ? JSON.parse(raw) : DEFAULT_POLICE_STATIONS;
            } catch (e) {
                list = DEFAULT_POLICE_STATIONS;
            }

            if (filters.division && filters.division !== 'all') {
                const divLower = filters.division.toLowerCase();
                list = list.filter(p => (p.division && p.division.toLowerCase() === divLower) || (p.divisionBn && p.divisionBn === filters.division));
            }
            if (filters.district && filters.district !== 'all') {
                const distLower = filters.district.toLowerCase();
                list = list.filter(p => (p.district && p.district.toLowerCase() === distLower) || (p.districtBn && p.districtBn === filters.district));
            }
            if (filters.query) {
                const q = filters.query.toLowerCase().trim();
                list = list.filter(p =>
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
                    (p.thana && p.thana.toLowerCase().includes(q)) ||
                    (p.thanaBn && p.thanaBn.toLowerCase().includes(q)) ||
                    (p.district && p.district.toLowerCase().includes(q)) ||
                    (p.districtBn && p.districtBn.toLowerCase().includes(q)) ||
                    (p.phone && p.phone.includes(q)) ||
                    (p.dutyOfficer && p.dutyOfficer.includes(q))
                );
            }
            return list;
        },

        savePoliceStation: function (stationData) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.POLICE);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_POLICE_STATIONS));

                if (!stationData.id) {
                    stationData.id = 'pol-' + Date.now();
                }
                const idx = list.findIndex(p => p.id === stationData.id);
                if (idx !== -1) {
                    list[idx] = Object.assign({}, list[idx], stationData);
                } else {
                    list.unshift(stationData);
                }
                localStorage.setItem(KEYS.POLICE, JSON.stringify(list));
                this.addActivityLog('Police Station Saved', `Police Thana "${stationData.nameBn || stationData.name}" record updated.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.POLICE);
                return { success: true, station: stationData };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deletePoliceStation: function (stationId) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.POLICE);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_POLICE_STATIONS));

                list = list.filter(p => p.id !== stationId);
                localStorage.setItem(KEYS.POLICE, JSON.stringify(list));
                this.addActivityLog('Police Station Deleted', `Station ID ${stationId} removed.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.POLICE);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        getEmergencyHotlines: function () {
            return [
                { number: '999', labelEn: 'National Emergency Service', labelBn: 'জাতীয় জরুরি সেবা (পুলিশ, এ্যাম্বুলেন্স, ফায়ার)', icon: 'fa-shield-halved', color: 'bg-red-600', ringColor: 'ring-red-400' },
                { number: '16122', labelEn: 'National Land Registry Citizen Helpline', labelBn: 'ভূমি সেবা হটলাইন (নাগরিক রেকর্ড সেবা)', icon: 'fa-earth-americas', color: 'bg-emerald-600', ringColor: 'ring-emerald-400' },
                { number: '01320001299', labelEn: 'Police HQ Central Control Room', labelBn: 'বাংলাদেশ পুলিশ হেডকোয়ার্টার্স কেন্দ্রীয় কন্ট্রোল', icon: 'fa-tower-broadcast', color: 'bg-blue-600', ringColor: 'ring-blue-400' },
                { number: '109', labelEn: 'Women & Child Emergency Helpline', labelBn: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন', icon: 'fa-person-breastfeeding', color: 'bg-purple-600', ringColor: 'ring-purple-400' },
                { number: '106', labelEn: 'Anti-Corruption Commission (ACC)', labelBn: 'দুর্নীতি দমন কমিশন (দুদক হটলাইন)', icon: 'fa-scale-balanced', color: 'bg-amber-600', ringColor: 'ring-amber-400' },
                { number: '102', labelEn: 'Fire Service Central Command', labelBn: 'ফায়ার সার্ভিস কেন্দ্রীয় কন্ট্রোল রুম', icon: 'fa-fire-extinguisher', color: 'bg-rose-700', ringColor: 'ring-rose-400' },
                { number: '333', labelEn: 'National Public Services Hotline', labelBn: 'সরকারি সেবা ও সামাজিক তথ্য হেল্পলাইন', icon: 'fa-circle-info', color: 'bg-slate-800', ringColor: 'ring-slate-400' }
            ];
        },

        // --- District Land & Agriculture Officials (Officials Section) ---
        getLandOfficials: function (filters = {}) {
            let list = [];
            try {
                const raw = localStorage.getItem(KEYS.OFFICIALS);
                list = raw ? JSON.parse(raw) : DEFAULT_LAND_OFFICIALS;
            } catch (e) {
                list = DEFAULT_LAND_OFFICIALS;
            }

            if (filters.division && filters.division !== 'all') {
                const divLower = filters.division.toLowerCase();
                list = list.filter(o => (o.division && o.division.toLowerCase() === divLower) || (o.divisionBn && o.divisionBn === filters.division));
            }
            if (filters.district && filters.district !== 'all') {
                const distLower = filters.district.toLowerCase();
                list = list.filter(o => (o.district && o.district.toLowerCase() === distLower) || (o.districtBn && o.districtBn === filters.district));
            }
            if (filters.sector && filters.sector !== 'all') {
                list = list.filter(o => o.sector === filters.sector);
            }
            if (filters.search) {
                const q = filters.search.toLowerCase().trim();
                list = list.filter(o => 
                    (o.officerNameEn && o.officerNameEn.toLowerCase().includes(q)) ||
                    (o.officerNameBn && o.officerNameBn.includes(q)) ||
                    (o.titleEn && o.titleEn.toLowerCase().includes(q)) ||
                    (o.titleBn && o.titleBn.includes(q)) ||
                    (o.district && o.district.toLowerCase().includes(q)) ||
                    (o.districtBn && o.districtBn.includes(q)) ||
                    (o.phone && o.phone.includes(q)) ||
                    (o.officeEn && o.officeEn.toLowerCase().includes(q)) ||
                    (o.officeBn && o.officeBn.includes(q)) ||
                    (o.servicesEn && o.servicesEn.toLowerCase().includes(q)) ||
                    (o.servicesBn && o.servicesBn.includes(q))
                );
            }
            return list;
        },

        saveLandOfficial: function (officialData) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.OFFICIALS);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_LAND_OFFICIALS));

                if (!officialData.id) {
                    officialData.id = 'off-' + Date.now();
                }
                const idx = list.findIndex(o => o.id === officialData.id);
                if (idx !== -1) {
                    list[idx] = Object.assign({}, list[idx], officialData);
                } else {
                    list.unshift(officialData);
                }
                localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(list));
                this.addActivityLog('Official Saved', `Official "${officialData.officerNameBn || officialData.officerNameEn}" saved.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.OFFICIALS);
                return { success: true, official: officialData };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteLandOfficial: function (officialId) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.OFFICIALS);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_LAND_OFFICIALS));

                list = list.filter(o => o.id !== officialId);
                localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(list));
                this.addActivityLog('Official Removed', `Official ID ${officialId} deleted.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.OFFICIALS);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        // --- Weather & Climate Center (Weather Section) ---
        getAllDistrictWeathers: function () {
            try {
                const raw = localStorage.getItem(KEYS.WEATHER);
                return raw ? JSON.parse(raw) : DEFAULT_DISTRICT_WEATHER;
            } catch (e) {
                return DEFAULT_DISTRICT_WEATHER;
            }
        },

        getDistrictWeather: function (district) {
            const all = this.getAllDistrictWeathers();
            if (!district) return all['Dhaka'] || DEFAULT_DISTRICT_WEATHER['Dhaka'];
            const distClean = district.trim().toLowerCase();
            for (let k in all) {
                if (k.toLowerCase() === distClean) {
                    return all[k];
                }
                if (all[k].districtBn && all[k].districtBn.toLowerCase() === distClean) {
                    return all[k];
                }
            }
            return all['Dhaka'] || DEFAULT_DISTRICT_WEATHER['Dhaka'];
        },

        saveDistrictWeather: function (districtKey, weatherData) {
            try {
                let all = this.getAllDistrictWeathers();
                all = Object.assign({}, all);
                all[districtKey] = Object.assign({}, all[districtKey] || {}, weatherData, { district: districtKey });
                localStorage.setItem(KEYS.WEATHER, JSON.stringify(all));
                this.addActivityLog('Weather Updated', `Weather advisory for "${weatherData.districtBn || districtKey}" updated.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.WEATHER);
                return { success: true, weather: all[districtKey] };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteDistrictWeather: function (districtKey) {
            try {
                let all = this.getAllDistrictWeathers();
                all = Object.assign({}, all);
                delete all[districtKey];
                localStorage.setItem(KEYS.WEATHER, JSON.stringify(all));
                this.addActivityLog('Weather Removed', `Weather entry for "${districtKey}" deleted.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.WEATHER);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        // --- Land Advisor & Planning Models (Land Planning Section) ---
        getLandAdvisorTemplates: function () {
            try {
                const raw = localStorage.getItem(KEYS.ADVISOR);
                return raw ? JSON.parse(raw) : DEFAULT_LAND_ADVISOR_TEMPLATES;
            } catch (e) {
                return DEFAULT_LAND_ADVISOR_TEMPLATES;
            }
        },

        saveLandAdvisorTemplates: function (templates) {
            try {
                localStorage.setItem(KEYS.ADVISOR, JSON.stringify(templates));
                this.addActivityLog('Advisor Templates Saved', 'Land planning models and guidelines updated.', 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.ADVISOR);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        saveLandAdvisorModel: function (modelData) {
            try {
                let templates = this.getLandAdvisorTemplates();
                templates = JSON.parse(JSON.stringify(templates));
                if (!templates.models) templates.models = [];

                if (!modelData.key) {
                    modelData.key = 'model-' + Date.now();
                }
                const idx = templates.models.findIndex(m => m.key === modelData.key);
                if (idx !== -1) {
                    templates.models[idx] = Object.assign({}, templates.models[idx], modelData);
                } else {
                    templates.models.push(modelData);
                }
                localStorage.setItem(KEYS.ADVISOR, JSON.stringify(templates));
                this.addActivityLog('Land Model Saved', `Land plan model "${modelData.nameBn || modelData.nameEn}" updated.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.ADVISOR);
                return { success: true, model: modelData };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteLandAdvisorModel: function (modelKey) {
            try {
                let templates = this.getLandAdvisorTemplates();
                templates = JSON.parse(JSON.stringify(templates));
                if (templates.models) {
                    templates.models = templates.models.filter(m => m.key !== modelKey);
                    localStorage.setItem(KEYS.ADVISOR, JSON.stringify(templates));
                    this.addActivityLog('Land Model Deleted', `Model key "${modelKey}" deleted.`, 'Admin sowrovshiekjh');
                    this._notifyChange(KEYS.ADVISOR);
                }
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        generateLandPlan: function (options = {}) {
            const templates = this.getLandAdvisorTemplates();
            const area = parseFloat(options.landArea) || 33.0; // Default 33 decimals (1 bigha)
            const purposeKey = options.purpose || 'fruits';
            const selectedModel = templates.models.find(m => m.key === purposeKey) || templates.models[0];

            // Calculate estimated costs and yields based on acreage
            let minDecCost = 8000;
            let maxDecCost = 12000;
            let minDecReturn = 15000;
            let maxDecReturn = 25000;

            if (purposeKey === 'crops') {
                minDecCost = 800; maxDecCost = 1500;
                minDecReturn = 3500; maxDecReturn = 5000;
            } else if (purposeKey === 'fisheries') {
                minDecCost = 2500; maxDecCost = 4000;
                minDecReturn = 6000; maxDecReturn = 10000;
            } else if (purposeKey === 'dairy') {
                minDecCost = 5000; maxDecCost = 8000;
                minDecReturn = 12000; maxDecReturn = 20000;
            } else if (purposeKey === 'warehouse') {
                minDecCost = 15000; maxDecCost = 25000;
                minDecReturn = 25000; maxDecReturn = 50000;
            } else if (purposeKey === 'farmhouse') {
                minDecCost = 10000; maxDecCost = 18000;
                minDecReturn = 18000; maxDecReturn = 30000;
            } else if (purposeKey === 'boundary') {
                minDecCost = 2000; maxDecCost = 4000;
                minDecReturn = 8000; maxDecReturn = 15000;
            }

            const totalMinBudget = Math.round(minDecCost * area);
            const totalMaxBudget = Math.round(maxDecCost * area);
            const totalMinReturn = Math.round(minDecReturn * area);
            const totalMaxReturn = Math.round(maxDecReturn * area);

            return {
                id: 'plan-' + Date.now(),
                createdAt: new Date().toISOString(),
                plotId: options.plotId || 'Custom Plot',
                dagNumber: options.dagNumber || 'DAG-Custom',
                mouza: options.mouza || 'Designated Mouza',
                district: options.district || 'Dhaka',
                area: area,
                areaBigha: (area / 33.0).toFixed(2),
                soilType: options.soilType || 'দোআঁশ ও পলিমাটি (Loamy Alluvial Soil)',
                waterSource: options.waterSource || 'ভূগর্ভস্থ গভীর নলকূপ ও নদী/খাল (Canal/Deep Tubewell)',
                purposeKey: purposeKey,
                model: selectedModel,
                financials: {
                    minBudget: totalMinBudget,
                    maxBudget: totalMaxBudget,
                    minAnnualReturn: totalMinReturn,
                    maxAnnualReturn: totalMaxReturn,
                    estimatedRoi: Math.round(((totalMinReturn / totalMaxBudget) * 100)) + '% - ' + Math.round(((totalMaxReturn / totalMinBudget) * 100)) + '%'
                },
                legalRoadmap: templates.legalRoadmap,
                timeline12Months: [
                    { monthBn: 'মাস ১ - ২', monthEn: 'Month 1-2', taskBn: 'ই-নামজারি অনুমোদন, সরকারি খতিয়ান সংগ্রহ, কর পরিশোধ ও আরসিসি সীমানা পিলার স্থাপন।', taskEn: 'e-Namzari completion, certified Khatian, tax clearance & RCC pillar demarcation.' },
                    { monthBn: 'মাস ৩ - ৪', monthEn: 'Month 3-4', taskBn: 'উপজেলা কৃষি অফিস ও SRDI থেকে মাটির pH পরীক্ষা, জমি সমতলকরণ ও সেচ লাইন স্থাপন।', taskEn: 'Soil testing via SRDI, land tilling/grading, and irrigation pump installation.' },
                    { monthBn: 'মাস ৫ - ৬', monthEn: 'Month 5-6', taskBn: 'উন্নত জাতের চারা/বীজ সংগ্রহ, বেড তৈরি ও প্রথম পর্যায়ের জৈব সার ও পুষ্টি প্রয়োগ।', taskEn: 'Procuring certified saplings/seeds, furrow layout, and organic composting.' },
                    { monthBn: 'মাস ৭ - ৮', monthEn: 'Month 7-8', taskBn: 'আইপিএম (IPM) বালাই দমন, ড্রিপ সেচ পরিচালনা ও নিয়মিত আগাছা পরিষ্কার।', taskEn: 'IPM bio-pest management, drip irrigation operation, and weeding maintenance.' },
                    { monthBn: 'মাস ৯ - ১০', monthEn: 'Month 9-10', taskBn: 'মধ্যবর্তী শাকসবজি ও আন্তঃফসল (Intercropping) উত্তোলন ও স্থানীয় বাজারে সরবরাহ।', taskEn: 'Harvesting intercropped seasonal vegetables and distributing to local bazars.' },
                    { monthBn: 'মাস ১১ - ১২', monthEn: 'Month 11-12', taskBn: 'মূল ফসলের ফলন শুরু, লাভ-ক্ষতি হিসাব চূড়ান্তকরণ এবং পরবর্তী মৌসুমের সম্প্রসারণ।', taskEn: 'Primary crop harvest kickoff, annual ROI balance reconciliation, and expansion.' }
                ]
            };
        },

        // --- Cadastral Photo Gallery (Gallery Section) ---
        getGalleryPhotos: function (category = 'all') {
            let list = [];
            try {
                const raw = localStorage.getItem(KEYS.GALLERY);
                list = raw ? JSON.parse(raw) : DEFAULT_GALLERY_PHOTOS;
            } catch (e) {
                list = DEFAULT_GALLERY_PHOTOS;
            }
            if (!category || category === 'all') return list;
            return list.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
        },

        saveGalleryPhoto: function (photoData) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.GALLERY);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_GALLERY_PHOTOS));

                if (!photoData.id) {
                    photoData.id = 'gal-' + Date.now();
                }
                const idx = list.findIndex(p => p.id === photoData.id);
                if (idx !== -1) {
                    list[idx] = Object.assign({}, list[idx], photoData);
                } else {
                    list.unshift(photoData);
                }
                localStorage.setItem(KEYS.GALLERY, JSON.stringify(list));
                this.addActivityLog('Photo Saved', `Gallery photo "${photoData.titleBn || photoData.titleEn}" saved.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.GALLERY);
                return { success: true, photo: photoData };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteGalleryPhoto: function (photoId) {
            try {
                let list = [];
                const raw = localStorage.getItem(KEYS.GALLERY);
                list = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_GALLERY_PHOTOS));

                list = list.filter(p => p.id !== photoId);
                localStorage.setItem(KEYS.GALLERY, JSON.stringify(list));
                this.addActivityLog('Photo Deleted', `Gallery photo ID ${photoId} deleted.`, 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.GALLERY);
                return { success: true };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        // --- Live Map Configuration (Live Map Section) ---
        getLiveMapConfig: function () {
            try {
                const c = localStorage.getItem(KEYS.MAP_CONFIG);
                return c ? JSON.parse(c) : {
                    defaultCenter: [23.8103, 90.4125],
                    defaultZoom: 11,
                    tileLayer: 'satellite',
                    defaultDistrict: 'Dhaka',
                    autoFitBounds: true
                };
            } catch (e) {
                return {
                    defaultCenter: [23.8103, 90.4125],
                    defaultZoom: 11,
                    tileLayer: 'satellite',
                    defaultDistrict: 'Dhaka',
                    autoFitBounds: true
                };
            }
        },

        saveLiveMapConfig: function (config) {
            try {
                const existing = this.getLiveMapConfig();
                const updated = Object.assign({}, existing, config);
                localStorage.setItem(KEYS.MAP_CONFIG, JSON.stringify(updated));
                this.addActivityLog('Map Settings Updated', 'Live Map center, zoom & satellite layer updated.', 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.MAP_CONFIG);
                return { success: true, config: updated };
            } catch (e) {
                return { success: false, error: e.message };
            }
        },

        deleteUser: function (username) {
            let users = this.getAllUsers();
            const target = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (!target) return false;

            users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
            localStorage.setItem(KEYS.USERS, JSON.stringify(users));

            let plots = this.getAllLands();
            plots = plots.filter(p => p.ownerUsername.toLowerCase() !== username.toLowerCase());
            localStorage.setItem(KEYS.PLOTS, JSON.stringify(plots));

            this.addActivityLog('User Deleted', `User "${target.fullName}" (${username}) removed.`, 'Admin sowrovshiekjh');
            this._notifyChange(KEYS.USERS);
            this._notifyChange(KEYS.PLOTS);
            return true;
        },

        // --- Land Plots Management (Full Control) ---
        getAllLands: function (filters = {}) {
            let plots = [];
            try {
                const p = localStorage.getItem(KEYS.PLOTS);
                plots = p ? JSON.parse(p) : DEFAULT_PLOTS;
            } catch (e) {
                plots = DEFAULT_PLOTS;
            }

            if (filters.username) {
                plots = plots.filter(p => p.ownerUsername.toLowerCase() === filters.username.toLowerCase());
            }
            if (filters.status) {
                plots = plots.filter(p => p.policeVerification === filters.status || p.imageVerification === filters.status);
            }
            if (filters.query) {
                const q = filters.query.toLowerCase();
                plots = plots.filter(p => 
                    (p.landNumber && p.landNumber.toLowerCase().includes(q)) ||
                    (p.mouza && p.mouza.toLowerCase().includes(q)) ||
                    (p.mouzaBn && p.mouzaBn.toLowerCase().includes(q)) ||
                    (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
                    (p.ownerNameBn && p.ownerNameBn.toLowerCase().includes(q)) ||
                    (p.currentCrop && p.currentCrop.toLowerCase().includes(q)) ||
                    (p.currentCropBn && p.currentCropBn.toLowerCase().includes(q)) ||
                    (p.district && p.district.toLowerCase().includes(q))
                );
            }
            return plots;
        },

        getLandsByUser: function (username) {
            return this.getAllLands({ username });
        },

        getLandById: function (id) {
            const plots = this.getAllLands();
            return plots.find(p => p.id === id);
        },

        saveLand: function (plotData) {
            const plots = this.getAllLands();
            const index = plots.findIndex(p => p.id === plotData.id);

            if (!plotData.ownerName && plotData.ownerUsername) {
                const user = this.getUser(plotData.ownerUsername);
                if (user) {
                    plotData.ownerName = user.fullName;
                    plotData.ownerNameBn = user.fullNameBn || user.fullName;
                    if (!plotData.district) plotData.district = user.district;
                }
            }

            if (index >= 0) {
                plots[index] = Object.assign({}, plots[index], plotData);
                this.addActivityLog('Plot Updated', `Plot ${plotData.landNumber} (${plotData.mouza}) modified.`, 'Admin sowrovshiekjh');
            } else {
                if (!plotData.id) plotData.id = 'plot-' + Date.now();
                if (!plotData.createdAt) plotData.createdAt = new Date().toISOString();
                plots.unshift(plotData);
                this.addActivityLog('Plot Registered', `New plot ${plotData.landNumber} registered.`, 'Admin sowrovshiekjh');
            }

            localStorage.setItem(KEYS.PLOTS, JSON.stringify(plots));
            this._notifyChange(KEYS.PLOTS);
            return plotData;
        },

        deleteLand: function (id) {
            let plots = this.getAllLands();
            const target = plots.find(p => p.id === id);
            if (!target) return false;

            plots = plots.filter(p => p.id !== id);
            localStorage.setItem(KEYS.PLOTS, JSON.stringify(plots));
            this.addActivityLog('Plot Deleted', `Land Plot ${target.landNumber} deleted.`, 'Admin sowrovshiekjh');
            this._notifyChange(KEYS.PLOTS);
            return true;
        },

        updatePlotVerification: function (id, updates) {
            const plots = this.getAllLands();
            const target = plots.find(p => p.id === id);
            if (!target) return null;

            Object.assign(target, updates);
            localStorage.setItem(KEYS.PLOTS, JSON.stringify(plots));
            this.addActivityLog('Verification Updated', `Plot ${target.landNumber} status updated.`, 'Admin sowrovshiekjh');
            this._notifyChange(KEYS.PLOTS);
            return target;
        },

        // --- Master Admin Secret Key & High Security Configuration ---
        DEFAULT_ADMIN_KEY: 'sowrov2026',

        getAdminSecretKey: function () {
            try {
                const k = localStorage.getItem(KEYS.ADMIN_SECURITY);
                return (k && k.trim()) ? k.trim() : this.DEFAULT_ADMIN_KEY;
            } catch (e) {
                return this.DEFAULT_ADMIN_KEY;
            }
        },

        setAdminSecretKey: function (newKey) {
            if (!newKey || newKey.trim().length < 4) {
                return { success: false, error: 'Secret key must be at least 4 characters long.' };
            }
            const cleanKey = newKey.trim();
            localStorage.setItem(KEYS.ADMIN_SECURITY, cleanKey);
            this.addActivityLog('Security Clearance Modified', `Admin secret access clearance key was changed to "${cleanKey}".`, 'Admin sowrovshiekjh');
            return { success: true, key: cleanKey };
        },

        verifyAdminSecretKey: function (inputKey) {
            if (!inputKey) return false;
            const validKey = this.getAdminSecretKey().toLowerCase();
            return String(inputKey).trim().toLowerCase() === validKey;
        },

        // --- Anti-Brute Force Lockout & Rate Limiting ---
        getLockoutState: function () {
            try {
                const raw = localStorage.getItem(KEYS.ADMIN_LOCKOUT);
                if (!raw) return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
                const state = JSON.parse(raw);
                const now = Date.now();
                if (state.lockoutUntil && state.lockoutUntil > now) {
                    const remaining = Math.ceil((state.lockoutUntil - now) / 1000);
                    return { isLocked: true, remainingSeconds: remaining, failedAttempts: state.failedAttempts || 3 };
                }
                // Lockout expired, reset automatically
                if (state.lockoutUntil && state.lockoutUntil <= now) {
                    this.resetLockoutState();
                    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
                }
                return { isLocked: false, remainingSeconds: 0, failedAttempts: state.failedAttempts || 0 };
            } catch (e) {
                return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
            }
        },

        recordFailedAttempt: function (attemptedUsername) {
            try {
                const current = this.getLockoutState();
                const newAttempts = (current.failedAttempts || 0) + 1;
                let lockoutUntil = null;
                const now = Date.now();

                if (newAttempts >= 3) {
                    // Lock out for 5 minutes (300 seconds)
                    lockoutUntil = now + (5 * 60 * 1000);
                    this.addActivityLog('Security Lockout Triggered', `3 failed login attempts recorded for "${attemptedUsername}". Bureau locked for 5 minutes.`, 'Security Guard');
                } else {
                    this.addActivityLog('Failed Admin Login', `Invalid login credentials submitted for "${attemptedUsername}". Attempt ${newAttempts}/3.`, 'Security Guard');
                }

                const newState = { failedAttempts: newAttempts, lockoutUntil: lockoutUntil };
                localStorage.setItem(KEYS.ADMIN_LOCKOUT, JSON.stringify(newState));
                return this.getLockoutState();
            } catch (e) {
                return { isLocked: false, remainingSeconds: 0, failedAttempts: 1 };
            }
        },

        resetLockoutState: function () {
            try {
                localStorage.removeItem(KEYS.ADMIN_LOCKOUT);
            } catch (e) {}
        },

        // --- Admin Authentication (sowrovshiekjh / 01742244518) with High Security ---
        checkAdminLogin: function (username, password) {
            const lockState = this.getLockoutState();
            if (lockState.isLocked) {
                return { 
                    success: false, 
                    error: `Security Lockout Active! Please wait ${lockState.remainingSeconds}s before retrying.`,
                    locked: true,
                    remainingSeconds: lockState.remainingSeconds
                };
            }

            const cleanUser = (username || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            if (cleanUser === ADMIN_CREDENTIALS.username.toLowerCase() && cleanPass === ADMIN_CREDENTIALS.password) {
                this.resetLockoutState();
                const sessionToken = 'sec_adm_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
                const sessionData = {
                    username: ADMIN_CREDENTIALS.username,
                    name: ADMIN_CREDENTIALS.name,
                    role: ADMIN_CREDENTIALS.role,
                    sessionToken: sessionToken,
                    loggedInAt: new Date().toISOString(),
                    lastActiveAt: Date.now()
                };
                localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(sessionData));
                this.addActivityLog('Admin Login', 'Administrator sowrovshiekjh authenticated successfully with 256-bit token.', 'sowrovshiekjh');
                return { success: true, admin: sessionData };
            }

            const newLock = this.recordFailedAttempt(cleanUser);
            if (newLock.isLocked) {
                return {
                    success: false,
                    error: 'Maximum failed attempts exceeded! Master Bureau locked for 5 minutes.',
                    locked: true,
                    remainingSeconds: newLock.remainingSeconds
                };
            }

            const remainingAttempts = 3 - newLock.failedAttempts;
            return { 
                success: false, 
                error: `Invalid admin credentials. Warning: ${remainingAttempts} attempt(s) remaining before security lockout.`,
                attemptsLeft: remainingAttempts
            };
        },

        getAdminSession: function () {
            try {
                const s = localStorage.getItem(KEYS.ADMIN_SESSION);
                if (!s) return null;
                const session = JSON.parse(s);
                // Check inactivity timeout (15 mins = 900,000 ms)
                const now = Date.now();
                if (session.lastActiveAt && (now - session.lastActiveAt > 15 * 60 * 1000)) {
                    this.clearAdminSession('Session expired due to 15 minutes of inactivity');
                    return null;
                }
                return session;
            } catch (e) {
                return null;
            }
        },

        touchAdminSession: function () {
            try {
                const s = localStorage.getItem(KEYS.ADMIN_SESSION);
                if (!s) return;
                const session = JSON.parse(s);
                session.lastActiveAt = Date.now();
                localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
            } catch (e) {}
        },

        checkAdminSessionTimeout: function (maxInactivityMs = 15 * 60 * 1000) {
            try {
                const s = localStorage.getItem(KEYS.ADMIN_SESSION);
                if (!s) return false;
                const session = JSON.parse(s);
                const now = Date.now();
                if (session.lastActiveAt && (now - session.lastActiveAt > maxInactivityMs)) {
                    this.clearAdminSession('Inactivity timeout (15m)');
                    return false;
                }
                return true;
            } catch (e) {
                return false;
            }
        },

        clearAdminSession: function (reason) {
            localStorage.removeItem(KEYS.ADMIN_SESSION);
            this.addActivityLog('Admin Logout', `Administrator session ended${reason ? ' (' + reason + ')' : ''}.`, 'sowrovshiekjh');
        },

        // --- Anti-Brute Force Lockout & Rate Limiting for Landowners/Users ---
        getUserLockoutState: function () {
            try {
                const raw = localStorage.getItem(KEYS.USER_LOCKOUT);
                if (!raw) return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
                const state = JSON.parse(raw);
                const now = Date.now();
                if (state.lockoutUntil && state.lockoutUntil > now) {
                    const remaining = Math.ceil((state.lockoutUntil - now) / 1000);
                    return { isLocked: true, remainingSeconds: remaining, failedAttempts: state.failedAttempts || 3 };
                }
                // Lockout expired, reset automatically
                if (state.lockoutUntil && state.lockoutUntil <= now) {
                    this.resetUserLockoutState();
                    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
                }
                return { isLocked: false, remainingSeconds: 0, failedAttempts: state.failedAttempts || 0 };
            } catch (e) {
                return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
            }
        },

        recordFailedUserAttempt: function (attemptedUsername) {
            try {
                const current = this.getUserLockoutState();
                const newAttempts = (current.failedAttempts || 0) + 1;
                let lockoutUntil = null;
                const now = Date.now();

                if (newAttempts >= 3) {
                    // Lock out for 5 minutes (300 seconds)
                    lockoutUntil = now + (5 * 60 * 1000);
                    this.addActivityLog('User Lockout Triggered', `3 failed login attempts recorded for "${attemptedUsername}". User access locked for 5 minutes.`, 'Security Guard');
                } else {
                    this.addActivityLog('Failed User Login', `Invalid login credentials submitted for "${attemptedUsername}". Attempt ${newAttempts}/3.`, 'Security Guard');
                }

                const newState = { failedAttempts: newAttempts, lockoutUntil: lockoutUntil };
                localStorage.setItem(KEYS.USER_LOCKOUT, JSON.stringify(newState));
                return this.getUserLockoutState();
            } catch (e) {
                return { isLocked: false, remainingSeconds: 0, failedAttempts: 1 };
            }
        },

        resetUserLockoutState: function () {
            try {
                localStorage.removeItem(KEYS.USER_LOCKOUT);
            } catch (e) {}
        },

        // --- High-Security User Authentication ---
        checkUserLogin: function (username, password) {
            const lockState = this.getUserLockoutState();
            if (lockState.isLocked) {
                return { 
                    success: false, 
                    error: `Security Lockout Active! Please wait ${lockState.remainingSeconds}s before retrying.`,
                    locked: true,
                    remainingSeconds: lockState.remainingSeconds
                };
            }

            const cleanUser = (username || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            const user = this.getUser(cleanUser);
            if (user && user.password === cleanPass) {
                this.resetUserLockoutState();
                const sessionUser = Object.assign({}, user, {
                    sessionToken: 'sec_usr_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36),
                    loggedInAt: new Date().toISOString(),
                    lastActiveAt: Date.now()
                });
                localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(sessionUser));
                this.addActivityLog('User Login', `User ${user.fullName} (${user.username}) authenticated successfully with 256-bit security token.`, user.username);
                this._notifyChange(KEYS.USER_SESSION);
                return { success: true, user: sessionUser };
            }

            const newLock = this.recordFailedUserAttempt(cleanUser || 'anonymous');
            if (newLock.isLocked) {
                return {
                    success: false,
                    error: 'Maximum failed attempts exceeded! User login is locked for 5 minutes.',
                    locked: true,
                    remainingSeconds: newLock.remainingSeconds
                };
            }

            const remainingAttempts = 3 - newLock.failedAttempts;
            return { 
                success: false, 
                error: `Invalid credentials. Warning: ${remainingAttempts} attempt(s) remaining before security lockout.`,
                attemptsLeft: remainingAttempts
            };
        },

        getUserSession: function () {
            try {
                const s = localStorage.getItem(KEYS.USER_SESSION);
                return s ? JSON.parse(s) : null;
            } catch (e) {
                return null;
            }
        },

        setUserSession: function (user) {
            localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(user));
            this._notifyChange(KEYS.USER_SESSION);
        },

        clearUserSession: function () {
            localStorage.removeItem(KEYS.USER_SESSION);
            this._notifyChange(KEYS.USER_SESSION);
        },

        // --- Aggregated Analytics & KPIs ---
        getStats: function () {
            const users = this.getAllUsers();
            const plots = this.getAllLands();

            const totalAreaDecimals = plots.reduce((acc, p) => {
                const match = (p.area || '').match(/([0-9.]+)/);
                return acc + (match ? parseFloat(match[1]) : 0);
            }, 0);

            const verifiedCount = plots.filter(p => 
                (p.policeVerification && p.policeVerification.includes('Approved')) && 
                p.imageVerification === 'Verified'
            ).length;

            const pendingPolice = plots.filter(p => 
                p.policeVerification && p.policeVerification.includes('Pending')
            ).length;

            const disputedCount = plots.filter(p => 
                (p.policeVerification && p.policeVerification.includes('Disputed')) || 
                p.imageVerification === 'Rejected'
            ).length;

            const crops = [...new Set(plots.map(p => p.currentCrop).filter(Boolean))];

            return {
                totalUsers: users.length,
                totalPlots: plots.length,
                totalAreaDecimals: parseFloat(totalAreaDecimals.toFixed(1)),
                totalAreaAcres: parseFloat((totalAreaDecimals / 100).toFixed(2)),
                verifiedCount: verifiedCount,
                pendingPolice: pendingPolice,
                disputedCount: disputedCount,
                uniqueCropsCount: crops.length,
                crops: crops
            };
        },

        // --- Activity Logs ---
        getActivityLogs: function () {
            try {
                const l = localStorage.getItem(KEYS.ACTIVITY_LOGS);
                return l ? JSON.parse(l) : [];
            } catch (e) {
                return [];
            }
        },

        addActivityLog: function (action, details, user = 'System') {
            const logs = this.getActivityLogs();
            logs.unshift({
                id: 'log-' + Date.now(),
                timestamp: new Date().toISOString(),
                action: action,
                details: details,
                user: user
            });
            if (logs.length > 50) logs.pop();
            localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
            this._notifyChange(KEYS.ACTIVITY_LOGS);
        },

        exportData: function () {
            return {
                version: '4.0',
                exportedAt: new Date().toISOString(),
                siteConfig: this.getSiteConfig(),
                slides: this.getSlides(),
                mapConfig: this.getLiveMapConfig(),
                advisorTemplates: this.getLandAdvisorTemplates(),
                weather: this.getAllDistrictWeathers(),
                officials: this.getLandOfficials(),
                policeStations: this.getPoliceStations(),
                plots: this.getAllLands(),
                gallery: this.getGalleryPhotos(),
                users: this.getAllUsers(),
                activityLogs: this.getActivityLogs()
            };
        },

        importData: function (data) {
            try {
                if (data.siteConfig) localStorage.setItem(KEYS.CONFIG, JSON.stringify(data.siteConfig));
                if (data.slides && Array.isArray(data.slides)) localStorage.setItem(KEYS.SLIDES, JSON.stringify(data.slides));
                if (data.mapConfig) localStorage.setItem(KEYS.MAP_CONFIG, JSON.stringify(data.mapConfig));
                if (data.advisorTemplates) localStorage.setItem(KEYS.ADVISOR, JSON.stringify(data.advisorTemplates));
                if (data.weather) localStorage.setItem(KEYS.WEATHER, JSON.stringify(data.weather));
                if (data.officials && Array.isArray(data.officials)) localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(data.officials));
                if (data.policeStations && Array.isArray(data.policeStations)) localStorage.setItem(KEYS.POLICE, JSON.stringify(data.policeStations));
                if (data.plots && Array.isArray(data.plots)) localStorage.setItem(KEYS.PLOTS, JSON.stringify(data.plots));
                if (data.gallery && Array.isArray(data.gallery)) localStorage.setItem(KEYS.GALLERY, JSON.stringify(data.gallery));
                if (data.users && Array.isArray(data.users)) localStorage.setItem(KEYS.USERS, JSON.stringify(data.users));
                this.addActivityLog('Database Restored', 'Complete cadastral database imported from external backup JSON.', 'Admin sowrovshiekjh');
                this._notifyChange(KEYS.PLOTS);
                return { success: true };
            } catch (err) {
                return { success: false, error: err.message };
            }
        },

        resetToDefaults: function () {
            localStorage.setItem(KEYS.CONFIG, JSON.stringify(DEFAULT_SITE_CONFIG));
            localStorage.setItem(KEYS.SLIDES, JSON.stringify(DEFAULT_SLIDES));
            localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
            localStorage.setItem(KEYS.PLOTS, JSON.stringify(DEFAULT_PLOTS));
            localStorage.setItem(KEYS.POLICE, JSON.stringify(DEFAULT_POLICE_STATIONS));
            localStorage.setItem(KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY_PHOTOS));
            localStorage.setItem(KEYS.OFFICIALS, JSON.stringify(DEFAULT_LAND_OFFICIALS));
            localStorage.setItem(KEYS.WEATHER, JSON.stringify(DEFAULT_DISTRICT_WEATHER));
            localStorage.setItem(KEYS.ADVISOR, JSON.stringify(DEFAULT_LAND_ADVISOR_TEMPLATES));
            localStorage.setItem(KEYS.MAP_CONFIG, JSON.stringify({
                defaultCenter: [23.8103, 90.4125],
                defaultZoom: 11,
                tileLayer: 'satellite',
                defaultDistrict: 'Dhaka',
                autoFitBounds: true
            }));
            this.addActivityLog('System Reset', 'System records restored to factory default settings.', 'Admin sowrovshiekjh');
            this._notifyChange(KEYS.CONFIG);
            this._notifyChange(KEYS.USERS);
            this._notifyChange(KEYS.PLOTS);
            return true;
        },

        showToast: function (title, message, type = 'success') {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            const colorClass = type === 'error' ? 'bg-red-900 border-red-700 text-red-100' :
                               type === 'warning' ? 'bg-amber-900 border-amber-700 text-amber-100' :
                               'bg-slate-900 border-emerald-600/80 text-white';
            const iconClass = type === 'error' ? 'fa-triangle-exclamation text-red-400' :
                              type === 'warning' ? 'fa-circle-exclamation text-amber-400' :
                              'fa-circle-check text-emerald-400';

            toast.className = `toast-item flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${colorClass}`;
            toast.innerHTML = `
                <i class="fa-solid ${iconClass} text-lg mt-0.5"></i>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold leading-tight">${title}</div>
                    <div class="text-[11px] text-slate-300 mt-0.5 break-words">${message}</div>
                </div>
                <button type="button" class="text-slate-400 hover:text-white text-sm" onclick="this.parentElement.remove()">&times;</button>
            `;

            container.appendChild(toast);
            setTimeout(() => {
                if (toast && toast.parentNode) toast.remove();
            }, 4500);
        }
    };

    GeoTerraStore.init();
    window.GeoTerraStore = GeoTerraStore;

})(window);
