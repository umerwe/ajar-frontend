export interface Transaction {
    _id: string;
    userId: string;
    type: "credit" | "debit";
    amount: number;
    status: "pending" | "succeeded" | "failed";
    source: string;
    paymentIntentId: string;
    createdAt: string;
    requestedAt: string;
    __v: number;
}

export interface BankAccount {
    _id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ibanNumber: string;
}