import { formatDate } from "@/utils/dateFormet";
import { Trash2, Pencil } from "lucide-react";
import { Switch } from "@/Components/ui/switch";
import Tag from "../ui/CustomUi/ReuseTag";

interface PromoCardProps {
    promo: IPromo;
    onEdit: (promo: IPromo) => void;
    onDelete: (promo: IPromo) => void;
    onToggle: (promo: IPromo) => void;
}

const PromoCard = ({ promo, onEdit, onDelete, onToggle }: PromoCardProps) => {
    return (
        <div className="rounded-xl border border-[#E5E5E5] bg-primary-color p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">

                <h1 className="flex-1 font-bold text-base sm:text-lg lg:text-xl truncate">{promo.title}</h1>
                <Switch
                    checked={promo.status === "ACTIVE"}
                    onCheckedChange={() => onToggle(promo)}
                />
                <button
                    onClick={() => onDelete(promo)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                >
                    <Trash2 className="size-5 cursor-pointer" />
                </button>
                <button
                    onClick={() => onEdit(promo)}
                    className="text-amber-500 hover:opacity-70 transition-opacity"
                >
                    <Pencil className="size-5 cursor-pointer" />
                </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#4A4A4A]">{promo.description}</p>

            {/* Details */}
            <div className="space-y-2 text-sm sm:text-base border-t border-border pt-3">
                <div className="flex justify-between">
                    <span className="font-bold ">Discount:</span>
                    <span className="font-medium">{promo.discount}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Min Spend:</span>
                    <span className="font-medium">₦{promo.minimumSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Expires:</span>
                    <span className="font-medium">
                        {formatDate(promo.expirationDate)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold ">Status:</span>
                    <Tag theme={promo.status === "ACTIVE" ? "success" : "error"}>
                        {promo.status}
                    </Tag>
                </div>
            </div>
        </div>
    );
};

export default PromoCard;
