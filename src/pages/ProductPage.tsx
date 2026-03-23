import { useEffect } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/features/product/productApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FieldGroup } from "@/Components/ui/field";
import { FormInput } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/Components/ui/button";
import tryCatchWrapper from "@/utils/tryCatchWrapper";

const schema = z.object({
  pricePerKit: z.coerce.number().min(1, "মূল্য আবশ্যক"),
  deliveryFeeInsideDhaka: z.coerce.number().min(0),
  deliveryFeeOutsideDhaka: z.coerce.number().min(0),
  deliveryFeeThreshold: z.coerce.number().min(1),
});

const ProductPage = () => {
  const { data } = useGetProductQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateProduct] = useUpdateProductMutation();
  const product = data?.data;

  const form = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (product) {
      form.reset({
        pricePerKit: product.pricePerKit,
        deliveryFeeInsideDhaka: product.deliveryFeeInsideDhaka,
        deliveryFeeOutsideDhaka: product.deliveryFeeOutsideDhaka,
        deliveryFeeThreshold: product.deliveryFeeThreshold,
      });
    }
  }, [product, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await tryCatchWrapper(updateProduct, { body: values }, "প্রোডাক্ট আপডেট হচ্ছে...");
  };

  return (
    <div className="py-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">প্রোডাক্ট সেটিংস</h1>
        <p className="text-muted-foreground text-sm mt-1">কিটের মূল্য ও ডেলিভারি চার্জ আপডেট করুন</p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="pricePerKit"
              label="প্রতি কিটের মূল্য (৳)"
              placeholder="যেমন: 230"
              type="number"
            />
            <FormInput
              control={form.control}
              name="deliveryFeeInsideDhaka"
              label="ডেলিভারি চার্জ — ঢাকার ভেতরে (৳)"
              placeholder="যেমন: 60"
              type="number"
            />
            <FormInput
              control={form.control}
              name="deliveryFeeOutsideDhaka"
              label="ডেলিভারি চার্জ — ঢাকার বাইরে (৳)"
              placeholder="যেমন: 120"
              type="number"
            />
            <FormInput
              control={form.control}
              name="deliveryFeeThreshold"
              label="প্রতি কত কিটে একটি ডেলিভারি চার্জ"
              placeholder="যেমন: 5"
              type="number"
            />
            <p className="text-xs text-muted-foreground -mt-2">
              উদাহরণ: থ্রেশহোল্ড ৫ হলে, ৯ কিট অর্ডারে ২× ডেলিভারি চার্জ প্রযোজ্য হবে।
            </p>
            <Button type="submit" className="w-full py-5 text-base">আপডেট করুন</Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};
export default ProductPage;
