"use client"

import React, { useState } from 'react'
import { Pencil, Trash2, Landmark, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    useGetBankAccountDetails,
    useAddBankAccount,
    useUpdateBankAccount,
    useDeleteBankAccount
} from '@/hooks/useWallet'
import { toast } from '@/components/ui/toast'
import { BankAccount } from '@/types/wallet'
import Header from '@/components/ui/header'
import SkeletonLoader from '@/components/common/skeleton-loader'

const BankAccountPage = () => {
    const { data, isLoading } = useGetBankAccountDetails();
    const bankAccounts: BankAccount[] = data?.bankAccounts || [];

    const addBankMutation = useAddBankAccount();
    const updateBankMutation = useUpdateBankAccount();
    const deleteBankMutation = useDeleteBankAccount();

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        ibanNumber: ''
    });

    const handleOpenAdd = () => {
        setEditingAccount(null);
        setFormData({ bankName: '', accountName: '', accountNumber: '', ibanNumber: '' });
        setIsOpen(true);
    };

    const handleOpenEdit = (bank: BankAccount) => {
        setEditingAccount(bank);
        setFormData({ ...bank });
        setIsOpen(true);
    };

    const handleOpenDelete = (id: string) => {
        setAccountToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await updateBankMutation.mutateAsync({ id: editingAccount._id, payload: formData });
                toast({ title: "Account updated successfully" });
            } else {
                await addBankMutation.mutateAsync(formData);
                toast({ title: "Account added successfully" });
            }
            setIsOpen(false);
        } catch (error) {
            toast({ title: "An error occurred" });
        }
    };

    const confirmDelete = async () => {
        if (!accountToDelete) return;
        try {
            await deleteBankMutation.mutateAsync(accountToDelete);
            toast({ title: "Account deleted" });
            setIsDeleteDialogOpen(false);
            setAccountToDelete(null);
        } catch (error) {
            toast({ title: "Failed to delete account" });
        }
    };

    return (
        <div>
            <Header
                title="Bank Accounts"
                onAddClick={handleOpenAdd}
            />

            <div className="max-w-2xl mx-auto p-6 space-y-4">
                {isLoading ?
                    <SkeletonLoader
                        variant="bank-accounts"
                    />
                    : (
                        <>
                            {bankAccounts.map((bank) => (
                                <Card key={bank._id} className="border bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className='pt-1'>
                                                    <Landmark className="text-blue-600 w-5 h-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="font-semibold text-lg tracking-tight">{bank.bankName}</h3>
                                                    <p className="text-slate-400 text-sm font-medium">{bank.accountName}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                <Button onClick={() => handleOpenEdit(bank)} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button onClick={() => handleOpenDelete(bank._id)} variant="destructive" size="icon" className="rounded-full w-9 h-9 shadow-sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3 border-t pt-5 border-slate-50">
                                            <div className="flex items-center">
                                                <span className="text-slate-400 text-xs uppercase tracking-wider w-36">Account Number</span>
                                                <span className="text-slate-700 font-mono text-sm">{bank.accountNumber}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-slate-400 text-xs uppercase tracking-wider w-36">IBAN</span>
                                                <span className="text-slate-700 font-mono text-sm">{bank.ibanNumber}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {bankAccounts.length === 0 && (
                                <div className="text-center py-20 text-slate-400 border-2 border-dashed rounded-2xl">
                                    No bank accounts added yet.
                                </div>
                            )}
                        </>
                    )}
            </div>

            {/* Main Form Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 pt-2 pb-2">
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} placeholder="e.g. HBL" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountName">Account Holder Name</Label>
                            <Input id="accountName" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} placeholder="0000 0000 0000" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ibanNumber">IBAN Number</Label>
                            <Input id="ibanNumber" value={formData.ibanNumber} onChange={(e) => setFormData({ ...formData, ibanNumber: e.target.value })} placeholder="PK00..." required />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" variant="destructive" className='w-full h-11 rounded-full' disabled={addBankMutation.isPending || updateBankMutation.isPending}>
                                {(addBankMutation.isPending || updateBankMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingAccount ? 'Update Bank Account' : 'Add Bank Account'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Custom Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">Delete Account</DialogTitle>
                        <DialogDescription className="py-4 text-center">
                            Are you sure you want to delete this bank account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row gap-3">
                        <Button variant="outline" className="flex-1 rounded-full h-11" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1 rounded-full h-11" onClick={confirmDelete} disabled={deleteBankMutation.isPending}>
                            {deleteBankMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BankAccountPage