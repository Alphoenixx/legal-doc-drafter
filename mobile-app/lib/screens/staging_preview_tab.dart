import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import '../providers/s3_upload_provider.dart';
import '../providers/document_generation_provider.dart';
import '../providers/local_state_providers.dart';
import '../theme/app_colors.dart';
import '../widgets/doc_type_card.dart';
import '../widgets/local_file_preview_dialog.dart';
import '../main.dart';
import 'dart:io';

class StagingPreviewTab extends ConsumerWidget {
  const StagingPreviewTab({super.key});

  void _showDocumentTypeSelector(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF111820),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          minChildSize: 0.4,
          maxChildSize: 0.9,
          expand: false,
          builder: (context, scrollController) {
            return Column(
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(24, 24, 24, 8),
                child: Text('Select Document Type', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ),
              Expanded(
                child: Consumer(
                  builder: (context, ref, child) {
                    void trigger(String docType) async {
                       final s3State = ref.read(s3UploadProvider);
                       if (s3State.s3Key == null) return;
                       
                       Navigator.pop(context); // Close bottom sheet
                       
                       // Trigger generation
                       ref.read(documentGenerationProvider.notifier).generateDocument(s3State.s3Key!, docType);

                       // Show loading dialog
                       showDialog(
                         context: context,
                         barrierDismissible: false,
                         builder: (BuildContext dialogContext) {
                           return Consumer(
                             builder: (context, ref, _) {
                               final genState = ref.watch(documentGenerationProvider);
                               
                               if (genState.status == GenerationStatus.success) {
                                 WidgetsBinding.instance.addPostFrameCallback((_) {
                                   if (Navigator.canPop(dialogContext)) {
                                     Navigator.pop(dialogContext); // close dialog
                                   }
                                   // Reset UI queue
                                   ref.read(localFileListProvider.notifier).clear();
                                   ref.read(selectedFileProvider.notifier).clear();
                                   ref.read(s3UploadProvider.notifier).reset();
                                   ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document generated! Check Final Drafts.')));
                                   
                                   // Auto-navigate to Final Drafts tab
                                   dashboardKey.currentState?.switchTab(2);
                                 });
                               } else if (genState.status == GenerationStatus.error) {
                                 return AlertDialog(
                                   title: const Text('Generation Failed'),
                                   content: Text(genState.errorMessage ?? 'Unknown error'),
                                   actions: [
                                     TextButton(
                                       onPressed: () => Navigator.pop(dialogContext),
                                       child: const Text('Close'),
                                     ),
                                   ],
                                 );
                               }

                               return const AlertDialog(
                                 content: Column(
                                   mainAxisSize: MainAxisSize.min,
                                   children: [
                                     CircularProgressIndicator(color: Color(0xFF2DD4BF)),
                                     SizedBox(height: 24),
                                     Text('AI is drafting your document...', style: TextStyle(fontWeight: FontWeight.bold)),
                                     SizedBox(height: 8),
                                     Text('This may take a few seconds.', style: TextStyle(color: Colors.grey, fontSize: 12)),
                                 ],
                               ),
                             );
                           }
                         );
                       }
                     );
                  }

                    return GridView.count(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 2.5,
                      children: [
                        DocTypeCard(title: 'NDA', subtitle: 'Non-Disclosure Agreement', icon: Icons.lock_outline, onTap: () => trigger('nda')),
                        DocTypeCard(title: 'MOU', subtitle: 'Mem. of Understanding', icon: Icons.handshake_outlined, onTap: () => trigger('mou')),
                        DocTypeCard(title: 'Service', subtitle: 'Service Agreement', icon: Icons.design_services_outlined, onTap: () => trigger('service_agreement')),
                        DocTypeCard(title: 'Partnership', subtitle: 'Partnership Agreement', icon: Icons.group_outlined, onTap: () => trigger('partnership_agreement')),
                        DocTypeCard(title: 'Collaboration', subtitle: 'Collaboration Agreement', icon: Icons.hub_outlined, onTap: () => trigger('collaboration_agreement')),
                        DocTypeCard(title: 'Contract', subtitle: 'General Contract', icon: Icons.description_outlined, onTap: () => trigger('contract')),
                        DocTypeCard(title: 'Statement', subtitle: 'Statement of Agreement', icon: Icons.article_outlined, onTap: () => trigger('statement_of_agreement')),
                        DocTypeCard(title: 'Resolution', subtitle: 'Meeting Resolution', icon: Icons.gavel_outlined, onTap: () => trigger('meeting_resolution')),
                      ],
                    );
                  }
                ),
              ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: Colors.grey),
                      ),
                      child: const Text('Cancel', style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ),
              ),
            ],
          );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fileList = ref.watch(localFileListProvider);
    final selectedFile = ref.watch(selectedFileProvider);

    // Render S3 errors silently failing in the background
    ref.listen(s3UploadProvider, (previous, next) {
      if (next.status == S3UploadStatus.error && next.errorMessage != null) {
        ScaffoldMessenger.of(context).clearSnackBars();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white),
                const SizedBox(width: 12),
                Expanded(child: Text(next.errorMessage!, style: const TextStyle(color: Colors.white))),
              ],
            ),
            backgroundColor: Colors.red.shade800,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    });

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Expanded(
                child: Text('Local Staging Queue', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey)),
              ),
              Chip(label: Text('${fileList.length} files', style: const TextStyle(fontSize: 12))),
            ],
          ),
          const SizedBox(height: 16),
          
          Expanded(
            child: fileList.isEmpty 
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppColors.accentDim(0.08),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.inventory_2_outlined, size: 48, color: AppColors.accent),
                      ),
                      const SizedBox(height: 24),
                      const Text('Staging Queue is Empty', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      const Text('Go to Upload tab to add documents.', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: fileList.length,
                  itemBuilder: (context, index) {
                    final platformFile = fileList[index];
                    final fileName = platformFile.name;
                    final isSelected = selectedFile?.name == fileName;

                    IconData iconData = Icons.insert_drive_file;
                    if (fileName.toLowerCase().endsWith('.pdf')) {
                      iconData = Icons.picture_as_pdf;
                    } else if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
                      iconData = Icons.description;
                    } else if (fileName.toLowerCase().endsWith('.txt')) {
                      iconData = Icons.text_snippet;
                    }

                    return Dismissible(
                      key: Key(platformFile.name),
                      direction: DismissDirection.endToStart,
                      background: Container(
                        alignment: Alignment.centerRight,
                        padding: const EdgeInsets.only(right: 20.0),
                        color: Colors.red.shade900,
                        child: const Icon(Icons.delete, color: Colors.white),
                      ),
                      onDismissed: (direction) {
                        ref.read(localFileListProvider.notifier).remove(platformFile);
                        if (isSelected) {
                          ref.read(selectedFileProvider.notifier).clear();
                        }
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${platformFile.name} removed from queue')),
                        );
                      },
                      child: Card(
                        color: isSelected ? const Color(0xFF2DD4BF).withValues(alpha: 0.1) : const Color(0xFF1A2332),
                        shape: RoundedRectangleBorder(
                          side: BorderSide(color: isSelected ? const Color(0xFF2DD4BF) : Colors.transparent),
                          borderRadius: BorderRadius.circular(8)
                        ),
                        child: InkWell(
                          onTap: () {
                             if (isSelected) {
                               // Deselect if currently selected
                               ref.read(selectedFileProvider.notifier).select(null);
                             } else {
                               // Select the file and show preview
                               ref.read(selectedFileProvider.notifier).select(platformFile);
                               showDialog(
                                 context: context,
                                 builder: (context) => LocalFilePreviewDialog(file: platformFile),
                               );
                             }
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: ListTile(
                            leading: Radio<PlatformFile?>(
                              value: platformFile,
                              groupValue: selectedFile,
                              activeColor: const Color(0xFF2DD4BF),
                              toggleable: true,
                              onChanged: (value) => ref.read(selectedFileProvider.notifier).select(value),
                            ),
                            title: Text(fileName, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                            trailing: Icon(iconData, color: Colors.grey),
                          ),
                        ),
                      ),
                    );
                  },
              ),
          ),
          
          const Divider(height: 32),
          
          // AWS Action Buttons
          Row(
            children: [
              Expanded(
                child: Consumer(
                  builder: (context, ref, child) {
                    final s3State = ref.watch(s3UploadProvider);
                    final isUploading = s3State.status == S3UploadStatus.uploading;
                    final isSuccess = s3State.status == S3UploadStatus.success;

                    return ElevatedButton.icon(
                      onPressed: (selectedFile == null || isUploading || isSuccess) ? null : () async {
                        List<int>? fileBytes = selectedFile.bytes;
                        if (fileBytes == null && selectedFile.path != null) {
                          try {
                            fileBytes = await File(selectedFile.path!).readAsBytes();
                          } catch (e) {
                            debugPrint('Failed to read file from path: $e');
                          }
                        }

                        if (fileBytes != null) {
                          ref.read(s3UploadProvider.notifier).uploadFile(selectedFile.name, fileBytes);
                        } else {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Error: File data unavailable. Cannot upload to S3.')),
                            );
                          }
                        }
                      },
                      icon: isUploading 
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : Icon(isSuccess ? Icons.check_circle : Icons.cloud_upload),
                      label: Text(isUploading ? 'Uploading ${selectedFile?.name ?? ""}...' : (isSuccess ? 'Uploaded' : 'Upload to S3')),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1A2332),
                        foregroundColor: isSuccess ? Colors.green : const Color(0xFF2DD4BF),
                      ),
                    );
                  }
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Consumer(
                  builder: (context, ref, child) {
                    final s3State = ref.watch(s3UploadProvider);
                    // Process button is ONLY enabled if the S3 upload was successful
                    final canProcess = s3State.status == S3UploadStatus.success;

                    return ElevatedButton.icon(
                      onPressed: canProcess ? () => _showDocumentTypeSelector(context) : null,
                      icon: const Icon(Icons.auto_awesome),
                      label: const Text('Process Selected'),
                    );
                  }
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
