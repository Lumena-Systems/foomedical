// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { InputLabel, LoadingOverlay, NativeSelect, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { formatFamilyName, formatGivenName, formatHumanName, normalizeErrorString } from '@medplum/core';
import type { HumanName, Patient } from '@medplum/fhirtypes';
import { AddressInput, Form, ResourceAvatar, useMedplum } from '@medplum/react';
import { IconCircleCheck, IconCircleOff } from '@tabler/icons-react';
import type { JSX } from 'react';
import { useState } from 'react';
import { InfoSection } from '../../components/InfoSection';
import { Btn } from '../../lumena/primitives';

export function Profile(): JSX.Element | null {
  const medplum = useMedplum();
  const [profile, setProfile] = useState(medplum.getProfile() as Patient);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(profile.address?.[0] || {});

  async function handleProfileEdit(formData: Record<string, string>): Promise<void> {
    setLoading(true);
    const newProfile: Patient = {
      ...profile,
      name: [
        {
          use: 'official',
          given: [formData.givenName],
          family: formData.familyName,
        },
      ],
      birthDate: formData.birthDate,
      gender: formData.gender as Patient['gender'],
      address: [address],
    };
    const updatedProfile = await medplum
      .updateResource(newProfile)
      .then((profile) => {
        showNotification({
          icon: <IconCircleCheck />,
          title: 'Success',
          message: 'Profile edited',
        });
        window.scrollTo(0, 0);
        return profile;
      })
      .catch((err) => {
        showNotification({
          color: 'red',
          icon: <IconCircleOff />,
          title: 'Error',
          message: normalizeErrorString(err),
        });
      });
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
    setLoading(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <Form onSubmit={handleProfileEdit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <ResourceAvatar size={120} radius={60} value={profile} />
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--fg-primary)',
              margin: 0,
            }}
          >
            {formatHumanName(profile.name?.[0])}
          </h1>
        </div>
        <InfoSection title="Personal information">
          <div style={{ padding: 20 }}>
            <Stack>
              <TextInput
                label="First name"
                name="givenName"
                defaultValue={formatGivenName(profile.name?.[0] as HumanName)}
              />
              <TextInput
                label="Last name"
                name="familyName"
                defaultValue={formatFamilyName(profile.name?.[0] as HumanName)}
              />
              <NativeSelect
                label="Gender"
                name="gender"
                defaultValue={profile.gender}
                data={['', 'female', 'male', 'other', 'unknown']}
              />
              <TextInput label="Birth date" name="birthDate" type="date" defaultValue={profile.birthDate} />
              <div>
                <Btn type="submit" variant="primary" size="md">
                  Save
                </Btn>
              </div>
            </Stack>
          </div>
        </InfoSection>
        <InfoSection title="Contact information">
          <div style={{ padding: 20 }}>
            <Stack>
              <TextInput
                label="Email"
                name="email"
                defaultValue={profile.telecom?.find((t) => t.system === 'email')?.value}
                disabled
              />
              <Stack gap={0}>
                <InputLabel htmlFor="address">Address</InputLabel>
                <AddressInput
                  name="address"
                  path="Patient.address"
                  defaultValue={address}
                  onChange={(address) => setAddress(address)}
                />
              </Stack>
              <div>
                <Btn type="submit" variant="primary" size="md">
                  Save
                </Btn>
              </div>
            </Stack>
          </div>
        </InfoSection>
      </Form>
    </div>
  );
}
