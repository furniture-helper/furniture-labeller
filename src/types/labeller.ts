import {isUrl} from "@/utils/url_utils";
import {removeAllNonNumericCharacters} from "@/utils/string_utils";

export type PageType = 'product' | 'home' | 'product_list' | 'error' | 'other';

export const PAGE_TYPES: PageType[] = ['product', 'home', 'product_list', 'error', 'other'];

export function isValidPageType(value: string): value is PageType {
    return PAGE_TYPES.includes(value as PageType);
}

export type PageLabelInput = {
    pageUrl: string;
    s3_key: string;
    pageType: string;
    productTitle: string | null;
    productImage: string | null;
    productPrice: string | null;
    brandId: number | null;
    otherBrand: string | null;
    inStock: boolean | null;
}

export type PageLabelRequest = {
    pageUrl: string;
    s3_key: string;
    pageType: PageType;
    productTitle?: string;
    productImage?: string;
    productPrice?: number;
    brandId?: number;
    otherBrand?: string;
    inStock?: boolean;
}

export function validatePageLabelInput(input: PageLabelInput): PageLabelRequest {
    const errors: string[] = [];

    if (!input.pageUrl) {
        errors.push("Page URL is required.");
    }

    if (input.pageUrl && !isUrl(input.pageUrl)) {
        errors.push("Page URL is not valid.");
    }

    if (!input.s3_key) {
        errors.push("S3 key is required.");
    }

    if (!input.pageType) {
        errors.push("Page type is required.");
    }

    if (input.pageType && !isValidPageType(input.pageType)) {
        errors.push("Page type is not valid.");
    }

    if (input.pageType !== "product") {
        // For non-product pages, we don't require product-specific fields
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return {
            pageUrl: input.pageUrl,
            s3_key: input.s3_key,
            pageType: input.pageType as PageType,
        }
    }

    if (!input.productTitle || input.productTitle.trim() === "") {
        errors.push("Product title is required.");
    }

    if (input.productImage && !isUrl(input.productImage)) {
        errors.push("Product image URL is not valid.");
    }

    input.productPrice = removeAllNonNumericCharacters(input.productPrice?.trim() || "");

    if (!input.productPrice || input.productPrice.trim() === "") {
        errors.push("Product price is required.");
    } else if (isNaN(Number(input.productPrice.trim()))) {
        errors.push("Product price must be a valid number.");
    }

    if (!input.brandId) {
        errors.push("Brand is required.");
    }

    if (input.brandId === -1 && (!input.otherBrand || input.otherBrand.trim() === "")) {
        errors.push("Other brand name is required when brand is 'Other'.");
    }

    if (input.inStock === null) {
        errors.push("In-stock status is required.");
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    const request: PageLabelRequest = {
        pageUrl: input.pageUrl,
        s3_key: input.s3_key,
        pageType: input.pageType as PageType,
        productTitle: input.productTitle!.trim(),
        productImage: input.productImage!.trim(),
        productPrice: Number(input.productPrice!.trim()),
        inStock: input.inStock!
    }

    if (input.brandId == -1) {
        request.otherBrand = input.otherBrand!.trim();
    } else {
        request.brandId = input.brandId!;
    }

    return request;
}