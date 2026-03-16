import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import '../providers/local_state_providers.dart';
import '../main.dart';

class UploadTab extends ConsumerStatefulWidget {
  const UploadTab({super.key});

  @override
  ConsumerState<UploadTab> createState() => _UploadTabState();
}

class _UploadTabState extends ConsumerState<UploadTab> {
  final _textController = TextEditingController();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Ingest Documents',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Add documents to your local staging queue.',
              style: TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            
            InkWell(
              onTap: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: ['pdf', 'docx', 'txt'],
                  withData: true, // Request bytes for S3 upload
                );
  
                if (result != null && result.files.isNotEmpty) {
                  ref.read(localFileListProvider.notifier).add(result.files.first);
                  ref.read(unseenUploadsProvider.notifier).increment();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${result.files.first.name} added to Staging Queue')),
                    );
                    dashboardKey.currentState?.switchTab(1); // Auto-navigate to Staging Tab
                  }
                }
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.withValues(alpha: 0.3), width: 2, style: BorderStyle.none),
                  borderRadius: BorderRadius.circular(16),
                  color: const Color(0xFF1A2332), // bg-elevated
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2DD4BF).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.cloud_upload_outlined, color: Color(0xFF2DD4BF), size: 48),
                    ),
                    const SizedBox(height: 16),
                    const Text('Click to browse files (PDF, DOCX, TXT)', style: TextStyle(fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
            ),
  
            const SizedBox(height: 32),
            const Row(
              children: [
                Expanded(child: Divider(color: Colors.grey)),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text('OR', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                ),
                Expanded(child: Divider(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 32),
  
            TextField(
              controller: _textController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Paste legal document text here...',
                filled: true,
                fillColor: const Color(0xFF0D1219),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF2DD4BF)),
                )
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                 final text = _textController.text.trim();
                 if (text.isEmpty) {
                   ScaffoldMessenger.of(context).showSnackBar(
                     const SnackBar(content: Text('Please paste some text first')),
                   );
                   return;
                 }

                 // Text pasting flow simulates a PlatformFile object for consistency
                 final timestamp = DateTime.now().millisecondsSinceEpoch;
                 final fileName = "Pasted_Text_$timestamp.txt";
                 
                 // Encode text properly for the payload (Bug 5 fix)
                 final bytes = Uint8List.fromList(utf8.encode(text));

                 // Create a mock PlatformFile representing the pasted text
                 final file = PlatformFile(
                   name: fileName,
                   size: bytes.length,
                   bytes: bytes,
                 );
  
                 ref.read(localFileListProvider.notifier).add(file);
                 ref.read(unseenUploadsProvider.notifier).increment();
                 
                 // Clear controller
                 _textController.clear();
                 // Unfocus
                 FocusManager.instance.primaryFocus?.unfocus();

                 ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Text added to Staging Queue')),
                 );
                 dashboardKey.currentState?.switchTab(1); // Auto-navigate to Staging Tab
              },
              icon: const Icon(Icons.add),
              label: const Text('Add as Text Document'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: const Color(0xFF2DD4BF),
                side: const BorderSide(color: Color(0xFF2DD4BF)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
