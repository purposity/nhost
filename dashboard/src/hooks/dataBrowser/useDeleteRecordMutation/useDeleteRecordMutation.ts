import { useCurrentWorkspaceAndApplication } from '@/hooks/useCurrentWorkspaceAndApplication';
import { generateRemoteAppUrl } from '@/utils/helpers';
import type { MutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type {
  DeleteRecordOptions,
  DeleteRecordVariables,
} from './deleteRecord';
import deleteRecord from './deleteRecord';

export interface UseDeleteRecordMutationOptions
  extends Partial<DeleteRecordOptions> {
  /**
   * Props passed to the underlying mutation hook.
   */
  mutationOptions?: MutationOptions<number, unknown, DeleteRecordVariables>;
}

/**
 * This hook is a wrapper around a fetch call that deletes one or more records
 * from the table.
 *
 * @param options - Options to use for the mutation.
 * @returns The result of the mutation.
 */
export default function useDeleteRecordMutation({
  dataSource: customDataSource,
  schema: customSchema,
  table: customTable,
  appUrl: customAppUrl,
  adminSecret: customAdminSecret,
  mutationOptions,
}: UseDeleteRecordMutationOptions = {}) {
  const {
    query: { dataSourceSlug, schemaSlug, tableSlug },
  } = useRouter();
  const { currentApplication } = useCurrentWorkspaceAndApplication();
  const appUrl = generateRemoteAppUrl(currentApplication?.subdomain);

  const mutation = useMutation(
    (variables) =>
      deleteRecord({
        ...variables,
        appUrl: customAppUrl || appUrl,
        adminSecret:
          customAdminSecret || currentApplication?.hasuraGraphqlAdminSecret,
        dataSource: customDataSource || (dataSourceSlug as string),
        schema: customSchema || (schemaSlug as string),
        table: customTable || (tableSlug as string),
      }),
    mutationOptions,
  );

  return mutation;
}
