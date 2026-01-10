"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = exports.SUPABASE_BUCKET_PUBLIC = exports.SUPABASE_DOMAIN_URL = exports.seoDescription = exports.COMPANY_INTERNAL_BUSINESS_PHONE = exports.COMPANY_INTERNAL_BUSINESS_ADDRESS = exports.COMPANY_INTERNAL_BUSINESS_EMAIL = exports.COMPANY_INTERNAL_BUSINESS_NAME = exports.PAYMENTS_DOWNPAYMENT_RATE = exports.URL_OFFICIAL_DOMAIN = exports.AWS_REGION = exports.AWS_S3_BUCKET_NAME = exports.API_ENDPOINT_PROD = void 0;
exports.API_ENDPOINT_PROD = "https://p3qab1ealh.execute-api.ap-southeast-1.amazonaws.com";
exports.AWS_S3_BUCKET_NAME = "majikah-solutions-public";
exports.AWS_REGION = "ap-southeast-1";
exports.URL_OFFICIAL_DOMAIN = "majikah.solutions";
//Booking Downpayment Rate
exports.PAYMENTS_DOWNPAYMENT_RATE = 0.5; //50% downpayment
//Company Information
exports.COMPANY_INTERNAL_BUSINESS_NAME = "Majikah";
exports.COMPANY_INTERNAL_BUSINESS_EMAIL = "business@majikah.solutions";
exports.COMPANY_INTERNAL_BUSINESS_ADDRESS = "Not Available";
exports.COMPANY_INTERNAL_BUSINESS_PHONE = "+63 900 000 0000";
exports.seoDescription = "The creative production OS for film, project management, and collaboration — where creativity meets clarity. Just like magic.";
//Supabase
exports.SUPABASE_DOMAIN_URL = "gydzizwxtftlmsdaiouw.supabase.co";
exports.SUPABASE_BUCKET_PUBLIC = "bucket-majikah-public";
exports.API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://majikah.solutions';
