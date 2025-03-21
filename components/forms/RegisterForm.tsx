"use client";

import { z } from "zod";
import { get } from "lodash";
import Image from "next/image";
import { useState } from "react";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import CustomFormField from "../CustomFormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl } from "@/components/ui/form";
import { PatientFormValidation } from "@/lib/validation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { registerPatient } from "@/lib/actions/patient.actions";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form?.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmailcom"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form?.control}
            name="phone"
            label="Phone number"
            placeholder="9999999999"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form?.control}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form?.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field: unknown) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={get(field, "onChange")}
                  defaultValue="field.value"
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="address"
            label="Address"
            placeholder="3rd street, Ernakulam"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Developer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form?.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="9999999999"
          />
        </div>

        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form?.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor?.name} value={doctor?.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor?.image}
                  width={32}
                  height={32}
                  alt={doctor?.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor?.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Niva Bupa / Tata AIA"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form?.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form?.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanutes, Penicillin, Pollen"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form?.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Ibuprofen 200mg, Calpol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form?.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had cholestrol, father had sugar"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form?.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>
        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form?.control}
          name="identification"
          label="Identification Type"
          placeholder="Select Identification Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form?.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="484892614838"
        />
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form?.control}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field: unknown) => (
            <FormControl>
              <FileUploader files={get(field, "value")} onChange={get(field, "onChange")} />
            </FormControl>
          )}
        />

        <section className="mb-12 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form?.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form?.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form?.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
