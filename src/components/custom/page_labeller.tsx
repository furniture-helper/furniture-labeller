import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input"
import {useState} from "react";
import useBrands from "@/hooks/useBrandsHook";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/components/ui/combobox";
import {Button} from "@/components/ui/button";
import {PageLabelInput, validatePageLabelInput} from "@/types/labeller";
import {Brand} from "@/types/brands";
import {Spinner} from "@/components/ui/spinner";

type Props = {
    pageUrl: string;
    s3_key: string;
}

export default function PageLabeller(props: Props) {
    const [pageType, setPageType] = useState<string>("product");
    const [productTitle, setProductTitle] = useState<string | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [productPrice, setProductPrice] = useState<string | null>(null);
    const [brandId, setBrandId] = useState<number | null>(null);
    const [otherBrand, setOtherBrand] = useState<string | null>(null);
    const [inStock, setInStock] = useState<boolean | null>(null);

    const {brands} = useBrands();

    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        const input: PageLabelInput = {
            pageUrl: props.pageUrl,
            s3_key: props.s3_key,
            pageType: pageType,
            productTitle: productTitle,
            productImage: productImage,
            productPrice: productPrice,
            brandId: brandId,
            otherBrand: otherBrand,
            inStock: inStock
        }

        try {
            setLoading(true);
            const validatedInput = validatePageLabelInput(input);
            console.log("Validated input:", validatedInput);

            await fetch('/api/label', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedInput),
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}. Message: ${response.statusText}`);
                }
                window.location.reload()
            })
        } catch (error) {
            if (error instanceof Error) {
                alert("Error: " + error.message);
            } else {
                alert("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`w-[400px] flex-col space-y-8`}>

            <div>
                <div className={`text-3xl font-bold`}>Label Page</div>
                <div className={`text-xs text-gray-400`}>{props.pageUrl}</div>
            </div>

            <FieldGroup>
                <Field>
                    <FieldLabel>Page type</FieldLabel>
                    <Select onValueChange={setPageType} defaultValue={pageType} disabled={loading}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Page Type"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="home">Home Page</SelectItem>
                                <SelectItem value="product_list">Product List</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            {pageType == "product" &&
                <FieldGroup>
                    <Field>
                        <FieldLabel>Product title</FieldLabel>
                        <Input onChange={(e) => setProductTitle(e.target.value)}
                               value={productTitle ? productTitle : ""} disabled={loading}/>
                    </Field>
                </FieldGroup>
            }

            {pageType == "product" &&
                <FieldGroup>
                    <Field>
                        <FieldLabel>Product image</FieldLabel>
                        <Input onChange={(e) => setProductImage(e.target.value)}
                               value={productImage ? productImage : ""} disabled={loading}/>
                    </Field>
                </FieldGroup>
            }


            {pageType == "product" &&
                <FieldGroup>
                    <Field>
                        <FieldLabel>Price</FieldLabel>
                        <Input onChange={(e) => setProductPrice(e.target.value)}
                               value={productPrice ? productPrice : ""} disabled={loading}/>
                    </Field>
                </FieldGroup>
            }

            {pageType == "product" && (
                <FieldGroup>
                    <Field>
                        <FieldLabel>Brand</FieldLabel>
                        <Combobox
                            items={brands || []}
                            onValueChange={(selected: Brand | null) => setBrandId(selected?.id ?? null)}
                            itemToStringValue={(item: Brand) => String(item.id)}
                            itemToStringLabel={(item: Brand) => item.name}
                            disabled={loading}
                        >
                            <ComboboxInput placeholder="Select a brand..."/>
                            <ComboboxContent>
                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item: Brand) => (
                                        <ComboboxItem key={item.id} value={item}>
                                            {item.name}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>

                    {brandId === -1 && (
                        <Field>
                            <FieldLabel>Enter new brand</FieldLabel>
                            <Input
                                onChange={(e) => setOtherBrand(e.target.value)}
                                value={otherBrand || ""}
                                placeholder="Brand name"
                                disabled={loading}
                            />
                        </Field>
                    )}
                </FieldGroup>
            )}

            {pageType == "product" &&
                <FieldGroup>
                    <Field>
                        <FieldLabel>In stock</FieldLabel>
                        <Select onValueChange={(value) => setInStock(value === "true")}
                                defaultValue={inStock !== null ? String(inStock) : undefined}
                                disabled={loading}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="In stock?"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                </FieldGroup>
            }

            <Button className={"cursor-pointer"} onClick={onSubmit} disabled={loading}>
                {loading ? <Spinner/> : "Submit"}
            </Button>
        </div>

    )
}