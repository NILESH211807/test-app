import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface ProductType {
    _id: string;
    userId: string;
    name: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

interface ProductCardProps {
    product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const [showSecret, setShowSecret] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Card className="w-full max-w-lg mx-auto border-muted-foreground/10 rounded-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold tracking-tight">
                    {product.name}
                </CardTitle>
                <CardDescription className='text-xs -mt-2 font-medium tracking-wide'>
                    Manage your application API credentials.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Client ID
                    </label>
                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value={product.clientId}
                            className="bg-muted/50 font-mono text-xs"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(product.clientId, 'id')}
                        >
                            {copiedField === 'id' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Client Secret
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                type={showSecret ? "text" : "password"}
                                readOnly
                                value={product.clientSecret}
                                className="bg-muted/50 font-mono text-xs pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecret(!showSecret)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(product.clientSecret, 'secret')}
                        >
                            {copiedField === 'secret' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Redirect URI
                    </label>
                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value={product.redirectUri}
                            className="bg-muted/50 font-mono text-xs"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(product.redirectUri, 'redirectUri')}
                        >
                            {copiedField === 'redirectUri' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;